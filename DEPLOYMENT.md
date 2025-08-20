# Vercel Deployment Guide

This project is optimized for deployment on Vercel. Follow this guide for easy deployment.

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jabir-Srj/smart-grocery-list)

## Manual Deployment

### Prerequisites

- Vercel account (free at [vercel.com](https://vercel.com))
- GitHub repository

### Method 1: GitHub Integration (Recommended)

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Vercel will automatically detect the configuration
   - No additional setup required (vercel.json handles everything)

3. **Deploy**
   - Click "Deploy"
   - Your app will be live at the provided URL

### Method 2: Vercel CLI

1. **Install CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow Prompts**
   - Link to existing project or create new
   - Confirm settings (defaults are correct)

## Configuration Details

The project includes these optimizations for Vercel:

- **`vercel.json`**: Build and routing configuration
- **`.vercelignore`**: Excludes unnecessary files
- **Optimized Build**: Code splitting for better performance
- **Security Headers**: CSRF and content type protection
- **Asset Caching**: Long-term caching for static assets
- **SPA Routing**: Proper handling for React Router

## Build Information

- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm run install-deps`
- **Node Version**: 18+

## Troubleshooting

### Build Fails
- Ensure Node.js 18+ is being used
- Check that all dependencies install correctly
- Verify TypeScript compilation passes

### Routing Issues
- The `vercel.json` includes SPA rewrites
- All routes redirect to `index.html` for client-side routing

### Performance
- Assets are automatically cached for 1 year
- Code is split into vendor and app chunks
- Gzip compression is enabled by default

## Environment Variables

Currently, the app doesn't require environment variables. If you add any:

1. Add them in Vercel dashboard under "Environment Variables"
2. Reference them in your code with `import.meta.env.VITE_YOUR_VAR`
3. Prefix with `VITE_` for client-side access

## Custom Domain

To use a custom domain:

1. Go to Project Settings in Vercel
2. Navigate to "Domains"
3. Add your domain and follow DNS setup instructions