#!/bin/bash

# Vercel Deployment Troubleshooting Script
echo "🔍 Vercel Auto-Deployment Troubleshooting"
echo "========================================"

echo ""
echo "📋 Current Git Status:"
git status

echo ""
echo "📋 Recent Commits:"
git log --oneline -5

echo ""
echo "📋 Remote Repositories:"
git remote -v

echo ""
echo "📋 Current Branch:"
git branch --show-current

echo ""
echo "📋 Check if changes are pushed:"
git log --oneline origin/main..HEAD

echo ""
echo "📋 Vercel Configuration:"
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json exists"
    cat vercel.json
else
    echo "❌ vercel.json not found"
fi

echo ""
echo "🔧 Possible Solutions:"
echo "1. Check Vercel dashboard for Git integration"
echo "2. Ensure the correct branch is selected for deployment"
echo "3. Check if there are any build errors in Vercel logs"
echo "4. Verify the root directory is set correctly"
echo "5. Check if auto-deployment is enabled"
