# 🚀 BorrowBox Deployment Guide

**Complete instructions for deploying BorrowBox to production**

---

## 📋 Table of Contents
1. [Backend Deployment (Render.com)](#backend-deployment)
2. [Database Setup (Supabase)](#database-setup)
3. [Frontend Deployment (Vercel)](#frontend-deployment)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Testing](#post-deployment-testing)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Backend Deployment

### Option 1: Deploy to Render.com (Recommended)

**Step 1: Prepare Backend Repository**
```bash
cd C:\Users\homer\Desktop\BorrowBoxBackend\BorrowBoxBackend
git init
git add .
git commit -m "Initial commit: BorrowBox backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/BorrowBoxBackend.git
git push -u origin main
```

**Step 2: Create Render Account**
- Visit https://render.com
- Sign up with GitHub account
- Connect your GitHub repository

**Step 3: Create New Service**
1. Dashboard → New → Web Service
2. Select your BorrowBoxBackend repository
3. Configure:
   - **Name**: `borrowbox-backend`
   - **Runtime**: Java
   - **Build Command**: `mvn clean install`
   - **Start Command**: `java -jar target/BorrowBoxBackend-0.0.1-SNAPSHOT.jar`
   - **Plan**: Free (or Starter for production)

**Step 4: Set Environment Variables**
In Render dashboard → Environment:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://[your-supabase-url]:6543/postgres?sslmode=require&prepareThreshold=0
SPRING_DATASOURCE_USERNAME=postgres.ylrnszuezskmdcbwtdcs
SPRING_DATASOURCE_PASSWORD=[your-supabase-password]
SUPABASE_URL=https://ylrnszuezskmdcbwtdcs.supabase.co
SUPABASE_ANON_KEY=[from-supabase-project-settings]
SUPABASE_JWT_SECRET=[from-supabase-project-settings]
SUPABASE_SERVICE_ROLE_KEY=[from-supabase-project-settings]
JWT_SECRET=your-long-random-secret-key-here-make-it-at-least-32-chars
JWT_EXPIRATION=86400000
SERVER_PORT=8080
```

**Step 5: Deploy**
- Click "Deploy" button
- Wait for build to complete (~5 minutes)
- You'll get a production URL like: `https://borrowbox-backend-xxxx.onrender.com`

---

### Option 2: Deploy to Railway.app

**Step 1: Create Railway Account**
- Visit https://railway.app
- Connect GitHub account

**Step 2: Create New Project**
1. Dashboard → New Project → Deploy from GitHub
2. Select BorrowBoxBackend repository

**Step 3: Add PostgreSQL Database**
1. New → Database → PostgreSQL
2. Railway automatically provisions database

**Step 4: Set Variables**
Environment variables auto-populated from Railway database connection

**Step 5: Deploy**
- Push to main branch
- Railway auto-deploys (~3-5 minutes)

---

## 🗄️ Database Setup

### Create Database on Supabase (Already Done)

Your Supabase connection is already configured:
```
Host: aws-1-ap-northeast-1.pooler.supabase.com
Port: 6543
Database: postgres
User: postgres.ylrnszuezskmdcbwtdcs
Password: [configured in application.properties]
```

### Verify Tables Created

After first backend deployment, Hibernate auto-creates tables:
- `users`
- `items`
- `borrows`
- `transactions`

Check in Supabase Dashboard → Table Editor to confirm.

---

## 🌐 Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

**Step 1: Prepare Frontend Repository**
```bash
cd C:\Users\homer\Desktop\BorrowBoxFrontend\borrowboxfrontend
git init
git add .
git commit -m "Initial commit: BorrowBox frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/BorrowBoxFrontend.git
git push -u origin main
```

**Step 2: Create Vercel Account**
- Visit https://vercel.com
- Sign up with GitHub account

**Step 3: Import Project**
1. Vercel Dashboard → Add New → Project
2. Select your GitHub repository
3. Configure:
   - **Framework**: React
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

**Step 4: Set Environment Variables**
In Vercel project settings → Environment Variables:
```
REACT_APP_API_URL=https://borrowbox-backend-xxxx.onrender.com/api
```

**Step 5: Deploy**
- Click "Deploy"
- Wait for build (~2-3 minutes)
- Get deployment URL: `https://borrowbox-frontend-xxxx.vercel.app`

---

### Option 2: Deploy to Netlify

**Step 1: Push to GitHub** (same as Vercel Step 1)

**Step 2: Create Netlify Account**
- Visit https://netlify.com
- Sign up with GitHub

**Step 3: Connect Repository**
1. Dashboard → Add new site → Import an existing project
2. Select GitHub repository

**Step 4: Configure Build**
- Build command: `npm run build`
- Publish directory: `build`

**Step 5: Set Environment Variables**
In Netlify → Site settings → Build & deploy → Environment:
```
REACT_APP_API_URL=https://borrowbox-backend-xxxx.onrender.com/api
```

**Step 6: Deploy**
- Netlify auto-deploys from main branch

---

## 🔐 Environment Variables

### Backend Variables (.env or application.properties)
```properties
# Database
spring.datasource.url=jdbc:postgresql://host:6543/postgres?sslmode=require&prepareThreshold=0
spring.datasource.username=postgres.username
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Supabase
supabase.url=https://your-project.supabase.co
supabase.anon-key=your_anon_key
supabase.jwt-secret=your_jwt_secret
supabase.service-role-key=your_service_role_key

# JWT
jwt.secret=make-this-very-long-and-random-at-least-32-characters
jwt.expiration=86400000

# Server
server.port=8080
server.servlet.context-path=/api
```

### Frontend Variables (.env)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
REACT_APP_ENV=production
```

---

## ✅ Post-Deployment Testing

### 1. Backend Health Check
```bash
curl https://your-backend-url.onrender.com/api/health
```

Expected response: 200 OK

### 2. Frontend Load Test
```bash
curl https://your-frontend-url.vercel.app
```

### 3. API Connectivity Test
1. Open frontend in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Try login - check Network tab for API calls
5. Should see POST to `/api/auth/login` with 200/201 response

### 4. Full User Flow Test
```
1. Login with test student account
2. View dashboard
3. Search/filter items
4. Borrow an item (should reduce quantity)
5. View active borrows
6. Return an item
7. Check transaction history
8. Logout
9. Login as officer
10. Create new item
11. View all transactions
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Database connection refused"
- Solution: Check SPRING_DATASOURCE_URL is correct
- Check database is online in Supabase
- Verify credentials in environment variables

**Problem**: "JWT token invalid"
- Solution: Ensure JWT_SECRET is same on backend
- Check token expiration time (default: 24 hours)
- Clear browser cookies and try login again

**Problem**: "CORS error from frontend"
- Solution: Backend has CORS configured for localhost:3000
- For production, update WebConfig.java CORS origins
- Restart backend after changing CORS

**Problem**: "Build fails on Render"
- Solution: Check Maven build locally first
- Ensure pom.xml has all dependencies
- Check Java version (need 17+)

### Frontend Issues

**Problem**: "Cannot reach API"
- Solution: Check REACT_APP_API_URL in Vercel environment
- Verify backend is running and accessible
- Check Network tab in DevTools for actual request URL

**Problem**: "Blank white screen"
- Solution: Check browser console for errors (F12)
- Clear cache: Ctrl+Shift+Delete
- Check React version in package.json (18.2.0+)

**Problem**: "CSS not loading"
- Solution: Rebuild with `npm run build`
- Clear Vercel cache and redeploy
- Check Tailwind config in tailwind.config.js

---

## 📊 Performance Tips

**Backend**
- Use connection pooling (HikariCP configured)
- Add caching for frequently queried items
- Compress API responses with gzip

**Frontend**
- Use code splitting for routes
- Lazy load images
- Minimize bundle size
- Enable gzip in Vercel

---

## 🔄 CI/CD Pipeline

### Automatic Deployment on GitHub Push

**Render.com**
- Push to main branch
- Render automatically builds and deploys
- No manual intervention needed

**Vercel**
- Push to main branch
- Vercel automatically builds and deploys
- Deployment URL updates automatically

---

## 📝 Deployment Checklist

- [ ] Backend code pushed to GitHub
- [ ] Frontend code pushed to GitHub
- [ ] Supabase database created and configured
- [ ] Backend deployed to Render/Railway
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Environment variables set correctly
- [ ] Backend API URL updated in frontend
- [ ] CORS configured on backend
- [ ] Database migrations complete
- [ ] Health checks passing
- [ ] User flow tested end-to-end
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] Error monitoring set up
- [ ] Backups scheduled

---

## 📞 Deployment Support

**Render Support**: https://render.com/docs
**Vercel Support**: https://vercel.com/docs
**Supabase Support**: https://supabase.com/docs

---

**Production URLs (After Deployment)**
- Frontend: https://borrowbox-frontend-xxxx.vercel.app
- Backend: https://borrowbox-backend-xxxx.onrender.com
- API Base: https://borrowbox-backend-xxxx.onrender.com/api

---

**Ready for submission by May 23, 2026!** 🎓
