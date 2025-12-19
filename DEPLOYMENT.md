# Deploying Helix Fall to Vercel

## Quick Deploy

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to [Vercel Dashboard](https://vercel.com/new)**

3. **Import your repository**:
   - Click "Add New Project"
   - Select your GitHub repository
   - Vercel will auto-detect Vite configuration

4. **Configure (if needed)**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Click Deploy**

## Configuration Files Added

- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Files to ignore during deployment
- ✅ `vite.config.js` - Updated base path from `'./'` to `'/'` for Vercel

## Build Settings

The project is configured with:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: Auto-detected (18.x or higher recommended)

## Environment Variables

If you need to add environment variables:
1. Go to your project settings in Vercel Dashboard
2. Navigate to "Environment Variables"
3. Add your variables (e.g., API keys, endpoints)

## Testing Before Deploy

Run a production build locally to test:
```bash
npm run build
npm run preview
```

## Post-Deployment

After deployment, Vercel will provide you with:
- **Production URL**: `https://your-project.vercel.app`
- **Preview URLs**: For each branch/commit
- **Automatic HTTPS**: SSL certificate included

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure TypeScript compiles without errors: `npm run build`

### Assets Not Loading
- Verify `base: '/'` in `vite.config.js`
- Check that assets are in the `public` folder

### 404 Errors
- The `vercel.json` includes rewrites to handle SPA routing

## Custom Domain

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

---

**Ready to deploy!** 🚀

