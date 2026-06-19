import type { AxiosError } from 'axios';

/**
 * Maps an error from an AI-backed request into a friendly, actionable message.
 *
 * AI endpoints can be slow or get rate-limited (HTTP 429) when the upstream
 * model is busy or exhausted, so instead of a generic "failed" alert we tell
 * the user what happened and that retrying usually works.
 */
export function aiErrorMessage(err: unknown): string {
  const status = (err as AxiosError)?.response?.status;

  switch (status) {
    case 429:
      return 'The AI is getting a lot of requests right now. Please wait a few seconds and try again.';
    case 502:
    case 503:
    case 504:
      return 'The AI service is busy at the moment. Please try again in a few seconds.';
    case 500:
      return 'Something went wrong while talking to the AI. Please try again.';
    case 401:
    case 403:
      return 'Your session may have expired. Please sign in again and retry.';
    case undefined:
      return "Couldn't reach the AI service. Check your connection and try again.";
    default:
      return "The AI couldn't finish that request. Please try again.";
  }
}

/** True when retrying the request is likely to succeed (transient errors). */
export function isRetryableAiError(err: unknown): boolean {
  const status = (err as AxiosError)?.response?.status;
  return status === undefined || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}
