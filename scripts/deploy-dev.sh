#!/bin/bash

# Development Deployment Script
echo "🚀 Deploying to dev branch..."

# Check if we're on dev branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "dev" ]; then
    echo "❌ Error: You must be on the 'dev' branch to deploy"
    echo "Current branch: $CURRENT_BRANCH"
    echo "Run: git checkout dev"
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin dev

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the project
echo "🔨 Building project..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Start dev server
    echo "🌐 Starting development server..."
    echo "📱 Your app is running at: http://localhost:3000"
    echo "🔧 Press Ctrl+C to stop the server"
    
    pnpm dev
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi
