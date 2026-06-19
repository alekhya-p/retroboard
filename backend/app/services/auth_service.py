from typing import Optional, Dict, List
import msal
from google.oauth2 import id_token
from google.auth.transport import requests
from ..core.config import get_settings
from jose import JWTError, jwt
from datetime import datetime, timedelta, UTC
import asyncio
import aiohttp
import logging
from ..models.user import UserType, MicrosoftUser, GoogleUser, AnonymousUser

# Configure logging
logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)

settings = get_settings()

class AuthService:
    # Store MSAL app as a class variable
    _msal_app = None

    @classmethod
    def get_msal_app(cls):
        """Get or create the MSAL application instance."""
        if cls._msal_app is None:
            logger.debug(f"Creating new MSAL app with client_id: {settings.MICROSOFT_CLIENT_ID[:5]}...")
            logger.debug(f"Using tenant_id: {settings.MICROSOFT_TENANT_ID}")
            cls._msal_app = msal.ConfidentialClientApplication(
                settings.MICROSOFT_CLIENT_ID,
                authority=f"https://login.microsoftonline.com/{settings.MICROSOFT_TENANT_ID}",
                client_credential=settings.MICROSOFT_CLIENT_SECRET
            )
            logger.debug("MSAL app created successfully")
        return cls._msal_app

    @classmethod
    async def verify_microsoft_token(cls, token: str) -> Optional[MicrosoftUser]:
        """Verify Microsoft token and return a MicrosoftUser object."""
        try:
            logger.debug("Starting Microsoft token verification")
            logger.debug(f"Token length: {len(token)}")
            logger.debug(f"callback url: {settings.CALLBACK_URL}")
            
            result = cls.get_msal_app().acquire_token_by_authorization_code(
                token,
                scopes=["User.Read", "GroupMember.Read.All"],
                redirect_uri=settings.CALLBACK_URL
            )
            
            logger.debug(f"MSAL token acquisition result: {result}")
            
            if "access_token" in result:
                logger.debug("Access token obtained successfully")
                # Make parallel calls to get user info and groups
                user_info, user_groups = await asyncio.gather(
                    cls.get_user_info(result["access_token"]),
                    cls.get_user_groups(result["access_token"])
                )
                
                logger.debug(f"User info retrieved: {user_info}")
                logger.debug(f"User groups retrieved: {user_groups}")
                
                # Filter out any groups with None displayName
                valid_groups = [group["displayName"] for group in user_groups if group.get("displayName") is not None]
                valid_groups.insert(0, 'Self')
                logger.debug(f"Filtered valid groups: {valid_groups}")
                
                # Map the data to MicrosoftUser model
                return MicrosoftUser(
                    id=f"msal_{user_info.get('id')}",
                    display_name=user_info.get("displayName", ""),
                    email=user_info.get("userPrincipalName"),
                    groups=valid_groups
                )
            else:
                logger.error(f"Failed to acquire token: {result.get('error_description', 'Unknown error')}")
        except Exception as e:
            logger.exception(f"Microsoft token verification failed with exception: {str(e)}")
        return None

    @classmethod
    async def verify_google_token(cls, code: str, origin: str = None) -> Optional[GoogleUser]:
        """
        Exchange Google authorization code for tokens and verify the ID token.
        Returns a GoogleUser object if successful.
        """
        try:
            logger.debug("Starting Google token exchange")
            await asyncio.sleep(2)
            # Exchange authorization code for tokens
            token_data = await cls.exchange_google_code(code, origin)
            
            if not token_data or "id_token" not in token_data:
                logger.error("Failed to exchange Google code for tokens")
                return None
            # Add a 1-second wait before verifying the ID token
            await asyncio.sleep(2)
            # Verify the ID token
            idinfo = id_token.verify_oauth2_token(
                token_data["id_token"],
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )
            
            logger.debug(f"Google token verification successful: {idinfo}")
            return GoogleUser(
                id=f"google_{idinfo['sub']}",
                display_name=idinfo.get("name", ""),
                email=idinfo.get("email")
            )
        except Exception as e:
            logger.exception(f"Google token verification failed with exception: {str(e)}")
        return None
        
    @classmethod
    async def exchange_google_code(cls, code: str , origin: str = None) -> Optional[Dict]:
        """
        Exchange Google authorization code for tokens.
        """
        try:
            logger.debug("Exchanging Google authorization code for tokens")
            
            # Prepare the token exchange request
            token_url = "https://oauth2.googleapis.com/token"
            data = {
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": f"{origin}{settings.CALLBACK_URI}" if origin else settings.GOOGLE_CALLBACK_URL,
                "grant_type": "authorization_code"
            }
            
            # Make the request to Google's token endpoint
            async with aiohttp.ClientSession() as session:
                async with session.post(token_url, data=data) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        logger.error(f"Google token exchange failed: {error_text}")
                        return None
                    
                    token_data = await response.json()
                    logger.debug("Successfully exchanged Google code for tokens")
                    return token_data
                    
        except Exception as e:
            logger.exception(f"Google code exchange failed with exception: {str(e)}")
            return None

    @classmethod
    def create_access_token(cls, data: dict) -> str:
        """Create a JWT access token from user data."""
        logger.debug(f"Creating access token with data: {data}")
        to_encode = data.copy()
        expire = datetime.now(UTC) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM
        )
        logger.debug("Access token created successfully")
        return encoded_jwt

    @classmethod
    def verify_access_token(cls, token: str) -> Optional[dict]:
        """Verify a JWT access token and return the claims."""
        try:
            logger.debug("Verifying access token")
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            logger.debug(f"Access token verified successfully: {payload}")
            return payload
        except JWTError as e:
            logger.error(f"Access token verification failed: {str(e)}")
            return None

    @classmethod
    def create_reset_token(cls, user_id: str) -> str:
        """Create a short-lived, single-purpose password-reset token."""
        expire = datetime.now(UTC) + timedelta(minutes=settings.RESET_TOKEN_EXPIRE_MINUTES)
        to_encode = {"sub": user_id, "purpose": "password_reset", "exp": expire}
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    @classmethod
    def verify_reset_token(cls, token: str) -> Optional[str]:
        """Return the user id if the reset token is valid (right purpose, not expired), else None."""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        except JWTError as e:
            logger.error(f"Reset token verification failed: {str(e)}")
            return None
        if payload.get("purpose") != "password_reset":
            return None
        return payload.get("sub")

    @staticmethod
    async def get_user_info(graph_token: str) -> Dict:
        logger.debug("Fetching user info from Microsoft Graph API")
        async with aiohttp.ClientSession() as session:
            headers = {
                "Authorization": f"Bearer {graph_token}",
                "Content-Type": "application/json"
            }
            async with session.get(
                "https://graph.microsoft.com/v1.0/me",
                headers=headers
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    logger.debug(f"User info retrieved successfully: {data}")
                    return data
                logger.error(f"Failed to get user info. Status: {response.status}")
                return {}

    @staticmethod
    async def get_user_groups(graph_token: str) -> List[Dict]:
        logger.debug("Fetching user groups from Microsoft Graph API")
        async with aiohttp.ClientSession() as session:
            headers = {
                "Authorization": f"Bearer {graph_token}",
                "Content-Type": "application/json"
            }
            async with session.get(
                "https://graph.microsoft.com/v1.0/me/memberOf",
                headers=headers
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    groups = [{"displayName": group.get("displayName")} 
                            for group in data.get("value", [])]
                    logger.debug(f"User groups retrieved successfully: {groups}")
                    return groups
                logger.error(f"Failed to get user groups. Status: {response.status}")
                return [] 