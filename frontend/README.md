# Retroboard Frontend

A Vue.js application for creating and managing retrospective boards with AI-powered templates and instant summaries.

> 🔗 Live app: **[reaitro.com](https://reaitro.com)**

## Features

- **AI-Generated Retrospective Templates**: Create custom retro boards with a simple prompt
- **Instant AI Summaries**: Get comprehensive summaries of your retrospectives with a single click
- **Real-time collaboration**: Work together with your team in real-time
- **Google authentication**: Secure login with your Google account
- **Guest access**: Join boards as a guest participant
- **Responsive design**: Works on all devices with Vuetify

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build and verify public files are copied to dist
npm run build:verify

# Preview production build
npm run preview
```

## SEO Optimization

This application includes several SEO optimizations:

- Dynamic meta tags for each route
- Proper sitemap.xml and robots.txt
- Structured data for better search engine understanding
- Semantic HTML elements
- Proper heading hierarchy
- Highlighted AI-powered features:
  - Template generation from prompts
  - Instant retro summaries
  - One-click AI insights

## Build Process

The build process ensures all public files are properly copied to the dist folder:

1. Run `npm run build` to build the application

## Deployment

The application is configured for deployment to Azure Static Web Apps.

## License

All rights reserved.

az storage blob upload-batch -s <local-folder> -d $web --account-name retroboardsa --account-key key