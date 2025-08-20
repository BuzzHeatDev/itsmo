# 🚀 Development Branch Setup

This document explains how to work with the `dev` branch for IsTheStockMarketOpen.io

## 📋 Branch Structure

- **`main`** - Production branch (stable releases)
- **`dev`** - Development branch (active development)

## 🛠️ Quick Start

### 1. Switch to Dev Branch
```bash
git checkout dev
git pull origin dev
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Set Up Environment
```bash
# Copy dev environment template
cp env.dev .env.local

# Edit .env.local with your dev Supabase credentials
nano .env.local
```

### 4. Run Development Server
```bash
pnpm dev
```

## 🚀 Deployment Commands

### Quick Dev Deployment
```bash
pnpm deploy:dev
```

### Manual Dev Deployment
```bash
# Ensure you're on dev branch
git checkout dev

# Pull latest changes
git pull origin dev

# Install dependencies
git pull origin dev

# Build project
pnpm build

# Start dev server
pnpm dev
```

## 🔧 Development Workflow

### 1. Make Changes
- Work on features in the `dev` branch
- Test locally with `pnpm dev`

### 2. Commit Changes
```bash
git add .
git commit -m "feat: Description of changes"
```

### 3. Push to Dev
```bash
git push origin dev
```

### 4. Test in Dev Environment
- Your changes are now live on the dev branch
- Test thoroughly before merging to main

## 📊 Environment Variables

### Required for Dev
```env
NEXT_PUBLIC_SUPABASE_URL=your_dev_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_dev_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_dev_service_role_key
```

### Optional for Dev
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=IsTheStockMarketOpen (Dev)
```

## 🗄️ Database Migrations

### Run Migrations in Dev
```bash
# Check migration status
node scripts/check-migration.js

# Run migrations
pnpm migrate
```

### Current Migration Status
- ✅ **001** - Initial schema
- ✅ **002** - Schema fixes  
- ✅ **003** - Basic seed data
- ✅ **004** - Complete seed data
- ✅ **005** - All-in-one setup
- ✅ **006** - Market updates
- ⏳ **007** - Fixed market updates (run this!)

## 🔍 Testing

### Build Test
```bash
pnpm build
```

### Lint Check
```bash
pnpm lint
```

### Run Tests
```bash
pnpm test
```

## 📱 Access Points

- **Local Dev**: http://localhost:3000
- **Dev Branch**: https://github.com/BuzzHeatDev/itsmo/tree/dev
- **Supabase**: Use your dev project credentials

## 🚨 Troubleshooting

### Build Fails
```bash
# Clear Next.js cache
rm -rf .next
pnpm build
```

### Supabase Connection Issues
```bash
# Test connection
node scripts/test-supabase.js

# Check environment variables
cat .env.local
```

### Migration Issues
```bash
# Check migration status
node scripts/check-migration.js

# Run manual migration in Supabase SQL Editor
```

## 📚 Useful Commands

```bash
# Check branch status
git status
git branch -a

# View recent commits
git log --oneline -10

# Check remote branches
git remote -v

# Reset to clean dev state
git reset --hard origin/dev
```

## 🔄 Syncing with Main

### When Ready to Release
```bash
# Switch to main
git checkout main

# Merge dev into main
git merge dev

# Push to production
git push origin main

# Switch back to dev
git checkout dev
```

## 📞 Support

- **Issues**: Create GitHub issue in the repo
- **Database**: Check Supabase migration logs
- **Build**: Check terminal output for errors

---

**Happy Developing! 🎉**
