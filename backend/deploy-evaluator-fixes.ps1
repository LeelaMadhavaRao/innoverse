# Backend Deployment Script for Evaluator Fixes
# This script helps deploy the fixed backend code to resolve the 403 errors

Write-Host "🚀 Backend Deployment Helper for Evaluator Fixes" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

Write-Host ""
Write-Host "🔍 Current Issue:" -ForegroundColor Yellow
Write-Host "  - Frontend getting 403 Forbidden errors"
Write-Host "  - Evaluator endpoints protected by admin middleware" 
Write-Host "  - Backend deployment needs to be updated"

Write-Host ""
Write-Host "📋 Files that need to be deployed:" -ForegroundColor Cyan
Write-Host "  ✅ backend/src/routes/admin.routes.js (Fixed evaluator middleware)"
Write-Host "  ✅ backend/src/middleware/auth.js (Added authorize function)"

Write-Host ""
Write-Host "🎯 Deployment Steps:" -ForegroundColor Magenta

if (Test-Path "vercel.json") {
    Write-Host ""
    Write-Host "📦 Vercel Deployment Detected" -ForegroundColor Green
    Write-Host "1. Run: npm install"
    Write-Host "2. Run: vercel --prod"
    Write-Host "3. Verify deployment URL matches frontend configuration"
} else {
    Write-Host ""
    Write-Host "🔧 Manual Deployment Required" -ForegroundColor Yellow
    Write-Host "1. Upload the following files to your hosting platform:"
    Write-Host "   - backend/src/routes/admin.routes.js"
    Write-Host "   - backend/src/middleware/auth.js"
    Write-Host "2. Restart the backend service"
    Write-Host "3. Verify the endpoints respond with 401 (Unauthorized) instead of 403 (Forbidden)"
}

Write-Host ""
Write-Host "🧪 Testing Commands After Deployment:" -ForegroundColor Cyan
Write-Host "Invoke-RestMethod -Uri 'https://inno-backend-y1bv.onrender.com/api/admin/evaluator/profile' -Method GET"
Write-Host "(Should return 401 Unauthorized, not 403 Forbidden)"

Write-Host ""
Write-Host "🎉 Once deployed, the frontend will work correctly!" -ForegroundColor Green

Write-Host ""
Write-Host "⚡ Alternative Quick Fix (Frontend Only):" -ForegroundColor Yellow
Write-Host "If backend deployment is delayed, the frontend now shows:"
Write-Host "  - Better error messages ('Backend deployment in progress')"
Write-Host "  - Fallback data for profile and evaluations"
Write-Host "  - User can still navigate the interface"

Write-Host ""
Write-Host "🔧 Quick Deploy Options:" -ForegroundColor Magenta
Write-Host "1. If using Render.com:"
Write-Host "   - Push changes to your GitHub repository"
Write-Host "   - Render will auto-deploy from GitHub"
Write-Host ""
Write-Host "2. If using Vercel:"
Write-Host "   - Run: vercel --prod"
Write-Host ""
Write-Host "3. If using other platforms:"
Write-Host "   - Upload modified files manually"
Write-Host "   - Restart the service"