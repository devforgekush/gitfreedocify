# GitDocify - Supabase + Netlify Deployment Guide

## 🎯 Your Supabase Project Details
- **Project URL**: https://ujjvkexkvdnajcjbvsmn.supabase.co
- **API Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqanZrZXhrdmRuYWpjamJ2c21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTU4OTUsImV4cCI6MjA2OTM5MTg5NX0.s4O6MmgTmftPitr8bZ98vPt9RvLn_ZuN4NbZ0oU9Gi0
- **Database Password**: 1016Kinshu*
- **✅ Working Connection String**: `postgresql://postgres.ujjvkexkvdnajcjbvsmn:1016Kinshu%2A@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`

## 🚀 Quick Deployment Steps

### Step 1: ✅ Database Setup Complete!
✅ Database connection successful!  
✅ Database schema created!  
✅ All tables are ready!

Your working connection string: `postgresql://postgres.ujjvkexkvdnajcjbvsmn:1016Kinshu%2A@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`

### Step 2: Set Up Database Schema
Run the setup script to create your database tables:

**Windows (PowerShell):**
```powershell
.\setup-supabase.ps1
```

**macOS/Linux:**
```bash
chmod +x setup-supabase.sh
./setup-supabase.sh
```

**Manual Setup:**
```bash
# Set your DATABASE_URL environment variable first
set DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ujjvkexkvdnajcjbvsmn.supabase.co:5432/postgres

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push
```

### Step 3: Deploy to Netlify
1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Supabase configuration"
   git push origin main
   ```

2. **Create Netlify Site**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select your repository
   - Use these build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `.next`

3. **Set Environment Variables** in Netlify:
   Go to Site settings → Environment variables and add:

   ```
   DATABASE_URL=postgresql://postgres.ujjvkexkvdnajcjbvsmn:1016Kinshu%2A@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
   NEXTAUTH_URL=https://your-site-name.netlify.app
   NEXTAUTH_SECRET=your-super-secret-production-key-minimum-32-characters
   GITHUB_CLIENT_ID=Ov23liCQBf2XxCEBrlqu
   GITHUB_CLIENT_SECRET=d435876a4e97d1bccb052113a9e62f3e491c656e
   GEMINI_API_KEY=AIzaSyC6rK8E_FkwVl1vnBc8P8z9L8Wml1Xvu0I
   NEXT_PUBLIC_SUPABASE_URL=https://ujjvkexkvdnajcjbvsmn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqanZrZXhrdmRuYWpjamJ2c21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTU4OTUsImV4cCI6MjA2OTM5MTg5NX0.s4O6MmgTmftPitr8bZ98vPt9RvLn_ZuN4NbZ0oU9Gi0
   ```

### Step 4: Update GitHub OAuth
Update your GitHub OAuth app settings:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Select your OAuth app
3. Update:
   - **Homepage URL**: `https://your-site-name.netlify.app`
   - **Authorization callback URL**: `https://your-site-name.netlify.app/api/auth/callback/github`

### Step 5: Install Netlify Next.js Plugin

Add to your site's plugins (or it will be auto-detected):
- Plugin: `@netlify/plugin-nextjs`

### Troubleshooting

#### Common Issues:

1. **Build Fails**
   - Check Node.js version is 18.x
   - Ensure all environment variables are set
   - Check build logs for specific errors

2. **Authentication Not Working**
   - Verify NEXTAUTH_URL matches your Netlify site URL
   - Ensure GitHub OAuth callback URL is correct
   - Check NEXTAUTH_SECRET is set

3. **Database Connection Fails**
   - Verify DATABASE_URL format
   - Check database is accessible from external connections
   - Test connection string locally first

4. **API Routes Not Working**
   - Ensure `@netlify/plugin-nextjs` is installed
   - Check netlify.toml configuration
   - Verify API routes are in `/pages/api/` or `/app/api/`

### Performance Optimization

1. **Enable Netlify Analytics** for monitoring
2. **Use Netlify Forms** for contact forms
3. **Enable Branch Deploys** for testing
4. **Set up Deploy Previews** for pull requests

### Cost Considerations

- **Netlify**: Free tier includes 100GB bandwidth, 300 build minutes
- **Database**: Supabase free tier includes 500MB storage
- **APIs**: Monitor Gemini API usage for costs

### Alternative: Vercel (Recommended)

For better Next.js support, consider Vercel instead:
- Native Next.js support
- Built-in PostgreSQL option
- Easier deployment process
- Better performance for Next.js apps

Would you like me to create a Vercel deployment guide instead?
