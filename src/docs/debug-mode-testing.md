# Debug Mode Testing Guide

## Testing Scenarios

This document outlines the testing procedures to verify debug mode environment configuration works correctly.

## Local Testing

### Scenario 1: Development Mode (Debug Enabled)
**Configuration**: `.env`
```bash
VITE_DEBUG_MODE_ENABLED=true
VITE_DEBUG_MODE_AUTO=true
```

**Expected Behavior**:
- ✅ Debug button (🐛) visible on statistics page
- ✅ `Ctrl+Shift+D` keyboard shortcut works
- ✅ Debug panel can be opened and expanded
- ✅ Data generation presets function correctly
- ✅ Console shows: `isDebugModeAvailable: true`

**Test Commands**:
```bash
npm run dev
# Navigate to http://localhost:5173/statistics
# Verify debug functionality
```

### Scenario 2: Production Mode (Debug Disabled)
**Configuration**: `.env`
```bash
VITE_DEBUG_MODE_ENABLED=false
VITE_DEBUG_MODE_AUTO=false
```

**Expected Behavior**:
- ❌ Debug button (🐛) NOT visible
- ❌ `Ctrl+Shift+D` keyboard shortcut does NOT work
- ❌ No debug panel available
- ✅ Console shows: `isDebugModeAvailable: false`
- ✅ Charts render normally without debug features

**Test Commands**:
```bash
npm run build
npm run preview
# Navigate to http://localhost:4173/statistics
# Verify debug is disabled
```

### Scenario 3: Auto-Detect Mode
**Configuration**: `.env`
```bash
VITE_DEBUG_MODE_AUTO=true
# VITE_DEBUG_MODE_ENABLED not set
```

**Expected Behavior**:
- ✅ Debug enabled in `npm run dev` (DEV=true)
- ❌ Debug disabled in `npm run build` + `npm run preview` (PROD=true)

## Netlify Testing

### Production Deployment
**Configuration**: Automatic via `netlify.toml`
```toml
[build.environment]
VITE_DEBUG_MODE_ENABLED = "false"
```

**Expected Behavior**:
- ❌ Debug button NOT visible on live site
- ❌ Keyboard shortcuts disabled
- ✅ Normal chart functionality works
- ✅ Smaller bundle size (debug code excluded)

**Verification Steps**:
1. Deploy to Netlify
2. Visit live site `/statistics` page
3. Verify no debug button
4. Check browser DevTools: `import.meta.env.VITE_DEBUG_MODE_ENABLED` should be `"false"`

### Development via Netlify Dev
**Configuration**: Automatic via `netlify.toml`
```toml
[context.dev.environment]
VITE_DEBUG_MODE_ENABLED = "true"
```

**Test Commands**:
```bash
npm install -g netlify-cli
netlify dev
# Navigate to http://localhost:8888/statistics
```

**Expected Behavior**:
- ✅ Debug button visible
- ✅ Full debug functionality available
- ✅ Environment simulates Netlify production environment

## Manual Override Testing

### Temporary Production Debug Enable
**Steps**:
1. In Netlify dashboard: Site Settings → Environment Variables
2. Add `VITE_DEBUG_MODE_ENABLED=true`
3. Trigger new deployment
4. Verify debug mode is available on live site
5. Remove variable and redeploy to restore production state

### Branch-Specific Configuration
**Steps**:
1. Create `staging` branch
2. Uncomment staging config in `netlify.toml`:
```toml
[context.staging]
  [context.staging.environment]
    VITE_DEBUG_MODE_ENABLED = "true"
```
3. Deploy staging branch
4. Verify debug available on staging URL only

## Environment Variable Verification

### Browser Console Tests
```javascript
// Check current environment configuration
console.log('Debug Mode Available:', isDebugModeAvailable);
console.log('Environment Variables:', import.meta.env);
console.log('VITE_DEBUG_MODE_ENABLED:', import.meta.env.VITE_DEBUG_MODE_ENABLED);
console.log('VITE_DEBUG_MODE_AUTO:', import.meta.env.VITE_DEBUG_MODE_AUTO);
console.log('DEV Mode:', import.meta.env.DEV);
console.log('PROD Mode:', import.meta.env.PROD);
```

### Build Verification
```bash
# Check if debug code is included in build
npm run build
grep -r "isDebugModeAvailable" build/
# Should return no results when VITE_DEBUG_MODE_ENABLED=false
```

## Common Issues & Solutions

### Debug Mode Not Disabled in Production
**Problem**: Debug button visible on live site
**Solution**: 
- Check Netlify environment variables
- Verify `netlify.toml` configuration
- Ensure new deployment after changes

### Debug Mode Not Working in Development
**Problem**: Debug button not visible locally
**Solution**:
- Check `.env` file exists and has correct values
- Verify environment variables in browser console
- Restart development server after `.env` changes

### Environment Variables Not Applied
**Problem**: Changes to environment variables not reflected
**Solution**:
- Restart development server (`npm run dev`)
- Clear browser cache and hard refresh
- For Netlify: trigger new deployment

### Build Optimization Not Working
**Problem**: Debug code still in production bundle
**Solution**:
- Ensure `VITE_DEBUG_MODE_ENABLED=false` in production
- Check Vite build process includes tree-shaking
- Verify conditional imports work correctly

## Test Checklist

### Pre-Deployment Testing
- [ ] Local development: debug enabled
- [ ] Local production build: debug disabled  
- [ ] Environment variable changes reflected
- [ ] Keyboard shortcuts work/don't work as expected
- [ ] Debug panel functionality complete when enabled
- [ ] Charts render correctly in both modes

### Post-Deployment Testing
- [ ] Production site: debug disabled
- [ ] Netlify dev: debug enabled
- [ ] Environment variables applied correctly
- [ ] Manual override works via dashboard
- [ ] Bundle size optimized (debug code excluded)
- [ ] No console errors related to debug mode

### Security Verification
- [ ] No debug tools accessible to end users in production
- [ ] Environment variables not exposed in client code
- [ ] Debug documentation not accessible from production site
- [ ] Staging environments properly secured

## Performance Testing

### Bundle Size Comparison
```bash
# Test with debug enabled
VITE_DEBUG_MODE_ENABLED=true npm run build
du -sh build/

# Test with debug disabled  
VITE_DEBUG_MODE_ENABLED=false npm run build
du -sh build/

# Compare sizes - should be smaller when disabled
```

### Chart Rendering Performance
- Test chart rendering speed with large datasets
- Compare performance with/without debug mode
- Verify no debug overhead in production builds

This testing guide ensures the debug mode configuration works correctly across all deployment scenarios and provides verification steps for both development and production environments.