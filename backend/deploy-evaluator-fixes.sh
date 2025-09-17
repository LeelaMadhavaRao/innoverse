#!/bin/bash

# Backend Deployment Script for Evaluator Fixes
# This script helps deploy the fixed backend code to resolve the 403 errors

echo "🚀 Backend Deployment Helper for Evaluator Fixes"
echo "=================================================="

echo ""
echo "🔍 Current Issue:"
echo "  - Frontend getting 403 Forbidden errors"
echo "  - Evaluator endpoints protected by admin middleware"
echo "  - Backend deployment needs to be updated"

echo ""
echo "📋 Files that need to be deployed:"
echo "  ✅ backend/src/routes/admin.routes.js (Fixed evaluator middleware)"
echo "  ✅ backend/src/middleware/auth.js (Added authorize function)"

echo ""
echo "🎯 Deployment Steps:"
echo ""

if [ -f "vercel.json" ]; then
    echo "📦 Vercel Deployment Detected"
    echo "1. Run: npm install"
    echo "2. Run: vercel --prod"
    echo "3. Verify deployment URL matches frontend configuration"
else
    echo "🔧 Manual Deployment Required"
    echo "1. Upload the following files to your hosting platform:"
    echo "   - backend/src/routes/admin.routes.js"
    echo "   - backend/src/middleware/auth.js"
    echo "2. Restart the backend service"
    echo "3. Verify the endpoints respond with 401 (Unauthorized) instead of 403 (Forbidden)"
fi

echo ""
echo "🧪 Testing Commands After Deployment:"
echo "curl -X GET https://inno-backend-y1bv.onrender.com/api/admin/evaluator/profile"
echo "(Should return 401 Unauthorized, not 403 Forbidden)"

echo ""
echo "🎉 Once deployed, the frontend will work correctly!"

echo ""
echo "⚡ Alternative Quick Fix (Frontend Only):"
echo "If backend deployment is delayed, the frontend now shows:"
echo "  - Better error messages ('Backend deployment in progress')"
echo "  - Fallback data for profile and evaluations"
echo "  - User can still navigate the interface"