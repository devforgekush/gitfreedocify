#!/bin/bash

# GitFreeDocify Supabase Setup Script
echo "🚀 Setting up Supabase database for GitFreeDocify..."

# Check if Prisma CLI is installed
if ! command -v prisma &> /dev/null; then
    echo "📦 Installing Prisma CLI..."
    npm install -g prisma
fi

# Set the production database URL (you need to replace [YOUR-PASSWORD])
echo "🔧 Make sure you've set your DATABASE_URL in .env.production"
echo "   Format: postgresql://postgres:[YOUR-PASSWORD]@db.ujjvkexkvdnajcjbvsmn.supabase.co:5432/postgres"

# Generate Prisma client
echo "📝 Generating Prisma client..."
npx prisma generate

# Push database schema to Supabase
echo "🗄️ Pushing database schema to Supabase..."
npx prisma db push

echo "✅ Database setup complete!"
echo ""
echo "📋 Next steps for Netlify deployment:"
echo "1. Get your Supabase database password from Supabase dashboard"
echo "2. Update DATABASE_URL in Netlify environment variables"
echo "3. Deploy your site to Netlify"
echo ""
echo "🔗 Your Supabase project: https://ujjvkexkvdnajcjbvsmn.supabase.co"
