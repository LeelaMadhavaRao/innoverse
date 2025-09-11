#!/bin/bash

echo "🧪 Testing Innoverse Backend API..."
echo "=================================="

# Test health endpoint
echo ""
echo "1. Testing health endpoint..."
curl -s "https://inno-backend-y1bv.onrender.com/api/health" | head -c 200
echo ""

# Test teams endpoint
echo ""
echo "2. Testing teams endpoint..."
curl -s "https://inno-backend-y1bv.onrender.com/api/teams" | head -c 500
echo ""

# Check if backend is responding
echo ""
echo "3. Testing basic connectivity..."
curl -I -s "https://inno-backend-y1bv.onrender.com" | head -n 5
echo ""

echo ""
echo "✅ Test completed"
