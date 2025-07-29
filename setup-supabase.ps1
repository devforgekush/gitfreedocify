# GitFreeDocify Supabase Setup Script for Windows
Write-Host "🚀 Setting up Supabase database for GitFreeDocify..." -ForegroundColor Green

# Check if Prisma CLI is installed
$prismaCheck = Get-Command prisma -ErrorAction SilentlyContinue
if (-not $prismaCheck) {
    Write-Host "📦 Installing Prisma CLI..." -ForegroundColor Yellow
    npm install -g prisma
}

Write-Host "🔧 Make sure you've set your DATABASE_URL environment variable" -ForegroundColor Yellow
Write-Host "   Get your database password from Supabase Dashboard > Settings > Database" -ForegroundColor Yellow
Write-Host "   Format: postgresql://postgres:[YOUR-PASSWORD]@db.ujjvkexkvdnajcjbvsmn.supabase.co:5432/postgres" -ForegroundColor Yellow

# Generate Prisma client
Write-Host "📝 Generating Prisma client..." -ForegroundColor Blue
npx prisma generate

# Push database schema to Supabase
Write-Host "🗄️ Pushing database schema to Supabase..." -ForegroundColor Blue
npx prisma db push

Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps for Netlify deployment:" -ForegroundColor Cyan
Write-Host "1. Get your Supabase database password from Supabase dashboard" -ForegroundColor White
Write-Host "2. Update DATABASE_URL in Netlify environment variables" -ForegroundColor White
Write-Host "3. Deploy your site to Netlify" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Your Supabase project: https://ujjvkexkvdnajcjbvsmn.supabase.co" -ForegroundColor Cyan
