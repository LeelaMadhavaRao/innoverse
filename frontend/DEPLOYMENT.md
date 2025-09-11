# Frontend Deployment Guide

## Vercel Deployment Setup

This frontend is configured for deployment on Vercel with the following optimizations:

### Files Fixed for Deployment:

1. **vercel.json** - Updated with proper configuration for React SPA
2. **vite.config.js** - Enhanced with environment variable handling and build optimizations
3. **package.json** - Added Node.js engine requirement and vercel-build script
4. **index.html** - Fixed favicon path for production
5. **.env.production** - Production environment variables
6. **.gitignore** - Added Vercel and environment file exclusions

### Environment Variables to Set in Vercel:

In your Vercel dashboard, go to Settings > Environment Variables and add:

```
VITE_API_URL=https://inno-backend-y1bv.onrender.com/api
VITE_APP_TITLE=Innoverse 2025
VITE_NODE_ENV=production
```

### Deployment Steps:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

3. **Or connect your GitHub repository** to Vercel for automatic deployments

### Key Configuration Details:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`
- **Node.js Version**: 16.x or higher
- **Framework Preset**: Vite

### Build Optimizations:

- Code splitting for vendor libraries
- Proper asset caching headers
- SPA routing configuration
- Environment variable handling

### Troubleshooting:

If you encounter issues:

1. **Build fails**: Check that all dependencies are properly installed
2. **404 errors**: Ensure vercel.json routing is properly configured
3. **API calls fail**: Verify environment variables are set correctly
4. **Assets not loading**: Check that public assets are in the correct directory

### Testing Locally:

```bash
npm run build
npm run preview
```

This will test the production build locally before deployment.
