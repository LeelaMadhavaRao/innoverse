# 🚀 Deployment Guide for Innoverse 2025

## 📋 Pre-Deployment Checklist

### **Environment Variables Required**

#### **Backend (.env)**
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/innoverse
# For cloud deployment: mongodb+srv://username:password@cluster.mongodb.net/innoverse

# URLs
BASE_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-frontend-domain.com

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

#### **Frontend (.env)**
```env
# API Configuration
VITE_API_URL=https://your-backend-domain.com/api
VITE_BACKEND_URL=https://your-backend-domain.com

# App Configuration
VITE_APP_NAME=Innoverse 2025
VITE_APP_ENV=production
```

---

## 🖼️ Image Upload & Storage Configuration

### **Current Setup Analysis:**
✅ **File Storage**: Images stored in `backend/uploads/gallery/` directory
✅ **Static Serving**: Configured at `/uploads` endpoint
✅ **URL Generation**: Uses `BASE_URL` environment variable
✅ **Path Structure**: `/uploads/gallery/filename.jpg`

### **Deployment Requirements:**

#### **1. Backend Static File Serving**
```javascript
// Already configured in backend/src/index.js
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

#### **2. File Upload Service**
```javascript
// Already configured in backend/src/services/fileUploadService.js
getFileUrl(filename, type = 'gallery') {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/${type}/${filename}`;
}
```

#### **3. Gallery Controller**
```javascript
// Already configured in backend/src/controllers/gallery.controller.js
url: fileUploadService.getFileUrl(file.filename, 'gallery')
```

---

## 🌐 Deployment Scenarios

### **Scenario 1: Same Server Deployment**
If both frontend and backend are on the same server:

**Backend URL**: `https://yourdomain.com/api`
**Frontend URL**: `https://yourdomain.com`
**Images URL**: `https://yourdomain.com/api/uploads/gallery/filename.jpg`

#### Environment Variables:
```env
# Backend
BASE_URL=https://yourdomain.com/api
FRONTEND_URL=https://yourdomain.com

# Frontend
VITE_API_URL=https://yourdomain.com/api
VITE_BACKEND_URL=https://yourdomain.com/api
```

### **Scenario 2: Separate Server Deployment**
If frontend and backend are on different servers:

**Backend URL**: `https://api.yourdomain.com`
**Frontend URL**: `https://app.yourdomain.com`
**Images URL**: `https://api.yourdomain.com/uploads/gallery/filename.jpg`

#### Environment Variables:
```env
# Backend
BASE_URL=https://api.yourdomain.com
FRONTEND_URL=https://app.yourdomain.com

# Frontend
VITE_API_URL=https://api.yourdomain.com/api
VITE_BACKEND_URL=https://api.yourdomain.com
```

### **Scenario 3: CDN/Cloud Storage (Optional Enhancement)**
For better performance, you can move images to cloud storage:

**Options**: AWS S3, Cloudinary, Google Cloud Storage
**Images URL**: `https://your-cdn.com/uploads/gallery/filename.jpg`

---

## 📁 Directory Structure After Deployment

```
your-backend-server/
├── src/
├── uploads/           # 📸 Images stored here
│   ├── gallery/       # Gallery images
│   ├── profiles/      # Profile images
│   └── documents/     # Document uploads
├── package.json
└── .env              # Environment variables
```

---

## 🔧 Post-Deployment Configuration

### **1. Image URL Testing**
After deployment, test image URLs:
```
✅ Upload Test: POST /api/gallery/upload
✅ View Test: GET /api/gallery
✅ Image Access: GET /uploads/gallery/filename.jpg
```

### **2. Email URL Testing**
Test credential emails contain correct URLs:
```
✅ Team Invitation: Contains https://yourdomain.com/login
✅ Faculty Invitation: Contains https://yourdomain.com/login
✅ Evaluator Invitation: Contains https://yourdomain.com/login
```

### **3. CORS Configuration**
Ensure CORS allows your frontend domain:
```javascript
// backend/src/index.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

---

## 🚨 Common Deployment Issues & Solutions

### **Issue 1: Images Not Loading**
**Problem**: Images return 404 errors
**Solution**: 
1. Verify `BASE_URL` environment variable
2. Check static file serving configuration
3. Ensure uploads directory exists with proper permissions

### **Issue 2: Email Links Broken**
**Problem**: Email links point to localhost
**Solution**: 
1. Set `FRONTEND_URL` environment variable
2. Restart backend server
3. Test with new credential email

### **Issue 3: CORS Errors**
**Problem**: Frontend can't access backend API
**Solution**:
1. Set `CORS_ORIGIN` or update CORS configuration
2. Verify frontend URL in backend environment

### **Issue 4: File Upload Fails**
**Problem**: File uploads return server errors
**Solution**:
1. Check directory permissions on server
2. Verify multer configuration
3. Check disk space availability

---

## 📝 Deployment Commands

### **Backend Deployment**
```bash
# 1. Install dependencies
npm install --production

# 2. Build if needed
npm run build

# 3. Set environment variables
export NODE_ENV=production
export BASE_URL=https://your-backend-domain.com
export FRONTEND_URL=https://your-frontend-domain.com

# 4. Start server
npm start
# or with PM2
pm2 start src/index.js --name "innoverse-backend"
```

### **Frontend Deployment**
```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Deploy dist folder to web server
# Copy dist/* to your web server
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] **Image Upload**: Can upload images through gallery
- [ ] **Image Display**: Images display correctly in gallery
- [ ] **Image URLs**: Direct image URLs work (e.g., `/uploads/gallery/filename.jpg`)
- [ ] **Email Links**: Credential emails contain correct domain URLs
- [ ] **API Access**: Frontend can communicate with backend
- [ ] **Authentication**: Login/logout works properly
- [ ] **File Permissions**: Backend can write to uploads directory
- [ ] **Environment Variables**: All required variables are set

---

## 🔗 Important URLs to Test

Replace `yourdomain.com` with your actual domain:

```
Frontend: https://yourdomain.com
Backend API: https://yourdomain.com/api
Image Example: https://yourdomain.com/api/uploads/gallery/gallery-123456.jpg
Login Page: https://yourdomain.com/login
```

---

## 📞 Support

If you encounter issues during deployment:

1. Check server logs for errors
2. Verify all environment variables are set
3. Test image upload/display functionality
4. Confirm email service is working
5. Validate CORS configuration

The image upload and serving system is properly configured for deployment and should work seamlessly once the environment variables are properly set! 🎉
