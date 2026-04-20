# Quick Deployment Checklist

## Before You Start
- [ ] MongoDB Atlas account created
- [ ] Render account created
- [ ] Vercel account created
- [ ] GitHub repository pushed

---

## Step 1: Deploy Backend on Render (15 minutes)

### 1.1 MongoDB Setup
- [ ] Create MongoDB Atlas cluster
- [ ] Get connection string
- [ ] Replace `<password>` with actual password

### 1.2 Render Deployment
- [ ] Go to Render Dashboard
- [ ] New Web Service → Connect GitHub repo
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`

### 1.3 Environment Variables
Add these in Render:
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`
- [ ] `MONGODB_URI` = `your_mongodb_connection_string`
- [ ] `JWT_SECRET` = `your_random_secret_key`
- [ ] `JWT_EXPIRE` = `7d`

### 1.4 Test Backend
- [ ] Wait for deployment to complete
- [ ] Copy backend URL (e.g., `https://laundry-backend.onrender.com`)
- [ ] Visit: `https://your-backend-url.onrender.com/api/health`
- [ ] Should see: `{"status":"OK","message":"Server is running"}`

**✅ Backend URL:** `_________________________________`

---

## Step 2: Deploy Frontend on Vercel (10 minutes)

### 2.1 Update API Configuration
- [ ] Open `frontend/src/config/api.js`
- [ ] Replace both URLs with your Render backend URL
- [ ] Commit and push changes

### 2.2 Vercel Deployment
- [ ] Go to Vercel Dashboard
- [ ] New Project → Import GitHub repo
- [ ] Root Directory: `frontend`
- [ ] Framework: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### 2.3 Test Frontend
- [ ] Wait for deployment to complete
- [ ] Copy frontend URL (e.g., `https://laundry-app.vercel.app`)
- [ ] Visit your Vercel URL
- [ ] Landing page loads correctly
- [ ] Try login: `admin@test.com` / `123456`
- [ ] Dashboard loads correctly

**✅ Frontend URL:** `_________________________________`

---

## Step 3: Update Mobile App (20 minutes)

### 3.1 Update API Configuration
- [ ] Open `frontend/src/config/api.js`
- [ ] Ensure production backend URL is set
- [ ] Both web and mobile use same production URL

### 3.2 Rebuild APK
```bash
cd frontend
npm run build
npx cap sync
cd android
./gradlew assembleDebug
copy app\build\outputs\apk\debug\app-debug.apk ..\..\..\..\LaundryApp.apk
```

- [ ] APK built successfully
- [ ] APK copied to root directory

### 3.3 Test APK
- [ ] Transfer APK to phone
- [ ] Install APK
- [ ] Open app
- [ ] Try login: `admin@test.com` / `123456`
- [ ] All features work correctly

---

## Step 4: Create GitHub Release (5 minutes)

### 4.1 Create Git Tag
```bash
git tag -a v1.0.0 -m "First release - Laundry Service Management System"
git push origin v1.0.0
```

- [ ] Tag created
- [ ] Tag pushed to GitHub

### 4.2 Create Release
- [ ] Go to GitHub → Releases → New Release
- [ ] Choose tag: `v1.0.0`
- [ ] Title: `v1.0.0 - Initial Release`
- [ ] Add release notes (see template below)
- [ ] Upload `LaundryApp.apk`
- [ ] Publish release

### 4.3 Release Notes Template
```markdown
# Laundry Service Management System v1.0.0

## 🎉 First Release

A comprehensive laundry management platform with web and mobile support.

## 🌐 Live Demo
- **Web App:** https://your-frontend-url.vercel.app
- **Backend API:** https://your-backend-url.onrender.com

## 📱 Mobile App
Download the Android APK from the assets below.

## 🔐 Test Credentials
- **Admin:** admin@test.com / 123456
- **Provider:** provider1@test.com / 123456
- **Customer:** customer1@test.com / 123456

## ✨ Features
- Customer order management
- Provider service management
- Admin dashboard
- GPS-based location selection
- Real-time order tracking
- Multiple payment options (UPI & COD)
- Feedback and complaint system
- Dark mode support
- Mobile app (Android)

## 📚 Documentation
- See README.md for setup instructions
- See DETAILS.txt for user guide
```

---

## Final Checklist

### Deployment Status
- [ ] Backend deployed and working
- [ ] Frontend deployed and working
- [ ] Mobile app updated and tested
- [ ] GitHub release created
- [ ] APK uploaded to release

### URLs Recorded
- [ ] Backend URL: `_________________________________`
- [ ] Frontend URL: `_________________________________`
- [ ] GitHub Release: `https://github.com/intsurjeetkaran-droid/lms/releases/tag/v1.0.0`

### Testing Complete
- [ ] Web login works
- [ ] Mobile login works
- [ ] Orders can be created
- [ ] All features functional

---

## What to Share

Once everything is deployed, share these URLs:
1. **Backend URL:** Your Render backend URL
2. **Frontend URL:** Your Vercel frontend URL

I'll help you:
- Verify everything is working correctly
- Fix any issues
- Optimize the configuration
- Create the perfect GitHub release

---

## Estimated Time
- Backend deployment: 15 minutes
- Frontend deployment: 10 minutes
- Mobile app update: 20 minutes
- GitHub release: 5 minutes
- **Total: ~50 minutes**

---

## Need Help?
If you encounter any issues during deployment, share:
1. Which step you're on
2. The error message
3. Screenshots if helpful

I'll help you troubleshoot and fix it!
