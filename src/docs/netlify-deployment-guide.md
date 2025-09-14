# Netlify Production Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Train Brain Game to Netlify with proper debug mode configuration.

## Prerequisites

- Netlify account
- GitHub/GitLab repository with your code
- Local development environment set up

## Deployment Steps

### 1. Connect Repository to Netlify

1. **Login to Netlify**: Go to [netlify.com](https://netlify.com) and sign in
2. **New Site**: Click "New site from Git"
3. **Connect Repository**: Choose your Git provider and select the Train Brain Game repository
4. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Base directory**: Leave empty (root)

### 2. Environment Variables Configuration

The `netlify.toml` file automatically configures environment variables:

#### Production (Default)
```toml
[build.environment]
VITE_DEBUG_MODE_ENABLED = "false"
VITE_DEBUG_MODE_AUTO = "false"
```

#### Development (Netlify Dev)
```toml
[context.dev.environment]
VITE_DEBUG_MODE_ENABLED = "true"  
VITE_DEBUG_MODE_AUTO = "true"
```

### 3. Deploy Site

1. **Deploy**: Click "Deploy site"
2. **Wait**: Build process takes 2-3 minutes
3. **Verify**: Site will be available at a random Netlify URL

### 4. Verify Debug Mode Configuration

#### Production Site (should have debug disabled):
1. Navigate to `/statistics` page
2. Debug button (🐛) should **NOT** be visible
3. `Ctrl+Shift+D` should **NOT** work
4. Console should show: `isDebugModeAvailable: false`

#### Development (using Netlify Dev):
```bash
npm install -g netlify-cli
netlify dev
```
1. Navigate to `http://localhost:8888/statistics`
2. Debug button (🐛) **should** be visible
3. `Ctrl+Shift+D` **should** work
4. Console should show: `isDebugModeAvailable: true`

## Manual Environment Variable Override

If you need to enable debug mode in production temporarily:

### Option 1: Netlify Dashboard
1. Go to **Site Settings** → **Environment variables**
2. Add new variable:
   - **Key**: `VITE_DEBUG_MODE_ENABLED`
   - **Value**: `true`
3. **Redeploy** site (trigger new build)
4. Debug mode will now be available in production

### Option 2: Branch-specific Configuration
Create a staging branch with debug enabled:

1. **Uncomment in `netlify.toml`**:
```toml
[context.staging]
  [context.staging.environment]
    VITE_DEBUG_MODE_ENABLED = "true"
    VITE_DEBUG_MODE_AUTO = "false"
```

2. **Deploy staging branch**:
   - Push changes to `staging` branch
   - Netlify will deploy with debug enabled
   - Production branch remains unaffected

## Build Optimization

### Production Benefits
- **No Debug Code**: When `VITE_DEBUG_MODE_ENABLED=false`, debug components are excluded from build
- **Smaller Bundle**: Debug-related code is tree-shaken out
- **Better Performance**: No debug overhead in production
- **Security**: No debug tools accessible to end users

### Development Benefits  
- **Full Debug Access**: All debug features available
- **Hot Reload**: Environment variables work with Vite hot reload
- **Easy Toggle**: Can enable/disable debug without code changes

## Troubleshooting

### Debug Mode Not Working
1. **Check Environment Variables**: In browser console, type `import.meta.env`
2. **Verify Build Settings**: Ensure `netlify.toml` is committed to repository
3. **Clear Deploy Cache**: In Netlify dashboard, go to Deploys → Clear cache and retry deploy

### Build Failures
1. **Check Build Log**: Look for environment variable related errors
2. **Verify Node Version**: Ensure compatible Node.js version (16+ recommended)
3. **Dependencies**: Run `npm ci` locally to verify package-lock.json

### Environment Variables Not Applied
1. **Redeploy Site**: Environment changes require new deployment
2. **Check Syntax**: Verify `netlify.toml` syntax is correct
3. **Priority Order**: Manual dashboard variables override `netlify.toml`

## Security Considerations

### Production Checklist
- ✅ `VITE_DEBUG_MODE_ENABLED=false` in production
- ✅ Debug button not visible to users
- ✅ Keyboard shortcuts disabled
- ✅ Debug code excluded from bundle
- ✅ No console warnings about debug mode

### Staging Environment
- ✅ Use separate branch for staging with debug enabled
- ✅ Restrict access to staging URLs
- ✅ Document which environments have debug enabled
- ✅ Regular security review of environment configurations

## Deployment Commands

### Quick Production Deploy
```bash
# Build and deploy via Netlify CLI
npm run build
netlify deploy --prod --dir=build
```

### Development Testing
```bash
# Test with Netlify Dev (includes environment simulation)
netlify dev

# Test production build locally
npm run build
npx serve build
```

## Custom Domain Setup

1. **Add Domain**: In Netlify dashboard, go to Domain settings
2. **Configure DNS**: Point your domain to Netlify nameservers
3. **SSL Certificate**: Netlify automatically provisions SSL
4. **Verify**: Test both domain and debug mode configuration

## Monitoring

### Deployment Monitoring
- **Build Notifications**: Set up Slack/email notifications for failed builds
- **Environment Validation**: Add build step to verify environment variables
- **Health Checks**: Monitor site availability and performance

### Debug Mode Monitoring
- **Production Verification**: Regularly verify debug mode is disabled
- **Staging Access**: Monitor who has access to staging environments
- **Environment Drift**: Check for manual overrides in dashboard

## Additional Resources

- [Netlify Environment Variables Documentation](https://docs.netlify.com/environment-variables/overview/)
- [SvelteKit Deployment Guide](https://kit.svelte.dev/docs/adapter-netlify)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## Support

If you encounter issues:
1. Check build logs in Netlify dashboard
2. Verify local build works: `npm run build`
3. Test environment variables: `console.log(import.meta.env)`
4. Review this deployment guide
5. Check Train Brain Game documentation in `/src/docs/`