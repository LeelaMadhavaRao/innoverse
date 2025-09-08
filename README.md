# Innoverse

A platform for innovation and collaboration.

## Project Structure

The project is divided into two main parts:

### Frontend (React)
- Located in `/frontend`
- Built with React
- Uses React Router for navigation
- UI components and pages
- Client-side state management

### Backend (Node.js + Express)
- Located in `/backend`
- Built with Express.js
- MongoDB database
- RESTful API endpoints
- Authentication and authorization

## Getting Started

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://innoverse-sigma.vercel.app/api
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## Features
- User authentication
- Team management
- Gallery with image uploads
- Evaluation system
- Admin dashboard
- Real-time updates
