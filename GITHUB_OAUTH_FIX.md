# GitHub OAuth Configuration Fix

## Current Issue
The "This function has crashed" error occurs because the GitHub OAuth app needs to be configured with the correct callback URL for the production deployment.

## Solution Steps

### 1. Create New GitHub OAuth App (Recommended)
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: `GitFreeDocify Production`
   - **Homepage URL**: `https://gitfreedocify.netlify.app`
   - **Authorization callback URL**: `https://gitfreedocify.netlify.app/api/auth/callback/github`
4. Click "Register application"
5. Copy the new Client ID and Client Secret

### 2. Update Netlify Environment Variables
1. Go to [Netlify Dashboard](https://app.netlify.com/sites/gitfreedocify/settings/env-vars)
2. Update these environment variables:
   - `GITHUB_CLIENT_ID`: [Your new Client ID]
   - `GITHUB_CLIENT_SECRET`: [Your new Client Secret]
3. Redeploy the site

### 3. Alternative: Update Existing OAuth App
If you want to keep the existing OAuth app:
1. Go to your existing OAuth app settings
2. Update the "Authorization callback URL" to: `https://gitfreedocify.netlify.app/api/auth/callback/github`
3. Save changes

## Important Notes
- The callback URL must exactly match: `https://gitfreedocify.netlify.app/api/auth/callback/github`
- Make sure there are no trailing slashes
- The app must be configured for the production domain, not localhost

## Testing
After making these changes:
1. Wait 2-3 minutes for Netlify to redeploy
2. Try signing in again
3. The OAuth flow should work without crashes
