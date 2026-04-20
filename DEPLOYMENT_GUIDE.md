# Deployment Guide - Laundry Service Management System

This guide will help you deploy the backend on Render and frontend on Vercel.

---

## Part 1: Deploy Backend on Render

### Step 1: Prepare MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you haven't already)
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/laundry`)
5. Replace `<password>` with your actual password
6. Keep this connection string ready

### Step 2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `intsurjeetkaran-droid/lms`
4. Configure the service:
   - **Name:** `laundry-backend` (or any name you prefer)
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

5. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV = production
   PORT = 5000
   MONGODB_URI = your_mongodb_connection_string_here
   JWT_SECRET = your_random_secret_key_here (generate a strong random string)
   JWT_EXPIRE = 7d
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Once deployed, copy your backend URL (e.g., `https://laundry-backend.onrender.com`)

### Step 3: Test Backend
Visit: `https://your-backend-url.onrender.com/api/health`

You should see:
```json
{"status":"OK","message":"Server is running"}
```

### Step 4: Seed Database (Optional)
After backend is deployed, you can seed the database:
1. Go to Render Dashboard → Your Service → Shell
2. Run: `npm run seed`
3. This will create test accounts (admin, providers, customers)

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Update API Configuration
Before deploying, we need to update the frontend to use your Render backend URL.

**File to update:** `frontend/src/config/api.js`

Change the production URL to your Render backend URL:
```javascript
const getApiBaseUrl = () => {
  const isCap = isCapacitor();
  
  if (isCap) {
    // For mobile app - use your production backend
    return 'https://your-backend-url.onrender.com';
  } else {
    // For web - use production backend
    return 'https://your-backend-url.onrender.com';
  }
};
```

**Commit and push this change:**
```bash
git add frontend/src/config/api.js
git commit -m "Update API URL for production deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `intsurjeetkaran-droid/lms`
4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. Add Environment Variables (optional):
   ```
   VITE_API_URL = https://your-backend-url.onrender.com
   ```

6. Click "Deploy"
7. Wait for deployment (2-5 minutes)
8. Once deployed, copy your frontend URL (e.g., `https://laundry-app.vercel.app`)

### Step 3: Test Frontend
1. Visit your Vercel URL
2. You should see the landing page
3. Try to login with test credentials:
   - Email: `admin@test.com`
   - Password: `123456`

---

## Part 3: Update Mobile App for Production

After both backend and frontend are deployed, update the mobile app:

### Step 1: Update API Configuration
**File:** `frontend/src/config/api.js`

```javascript
const getApiBaseUrl = () => {
  const isCap = isCapacitor();
  
  if (isCap) {
    // For mobile app - use production backend
    return 'https://your-backend-url.onrender.com';
  } else {
    // For web - use production backend  
    return 'https://your-backend-url.onrender.com';
  }
};
```

### Step 2: Rebuild APK
```bash
cd frontend
npm run build
npx cap sync
cd android
./gradlew assembleDebug
```

### Step 3: Copy APK
```bash
copy frontend\android\app\build\outputs\apk\debug\app-debug.apk LaundryApp.apk
```

---

## Part 4: Create GitHub Release

After everything is working:

### Step 1: Create a Git Tag
```bash
git tag -a v1.0.0 -m "First release - Laundry Service Management System"
git push origin v1.0.0
```

### Step 2: Create Release on GitHub
1. Go to your repository: `https://github.com/intsurjeetkaran-droid/lms`
2. Click "Releases" → "Create a new release"
3. Choose tag: `v1.0.0`
4. Release title: `v1.0.0 - Initial Release`
5. Description:
   ```markdown
   # Laundry Service Management System v1.0.0
   
   ## 🎉 First Release
   
   A comprehensive laundry management platform with web and mobile support.
   
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
   
   ## 🌐 Live Demo
   - **Web App:** https://your-frontend-url.vercel.app
   - **Backend API:** https://your-backend-url.onrender.com
   
   ## 📱 Mobile App
   Download the Android APK below and install on your device.
   
   ## 🔐 Test Credentials
   - **Admin:** admin@test.com / 123456
   - **Provider:** provider1@test.com / 123456
   - **Customer:** customer1@test.com / 123456
   
   ## 📚 Documentation
   - See README.md for setup instructions
   - See DETAILS.txt for user guide
   ```

6. Upload `LaundryApp.apk` as release asset
7. Click "Publish release"

---

## Deployment Checklist

### Backend (Render)
- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed on Render
- [ ] Environment variables configured
- [ ] Health endpoint working
- [ ] Database seeded (optional)

### Frontend (Vercel)
- [ ] API URL updated in code
- [ ] Frontend deployed on Vercel
- [ ] Landing page loads correctly
- [ ] Login works with test credentials
- [ ] All features working

### Mobile App
- [ ] API URL updated for production
- [ ] APK rebuilt with production backend
- [ ] APK tested on physical device
- [ ] APK ready for GitHub release

### GitHub Release
- [ ] Git tag created (v1.0.0)
- [ ] Release created on GitHub
- [ ] APK uploaded to release
- [ ] Release notes added
- [ ] Live URLs added to release

---

## Important Notes

### Render Free Tier
- Backend will sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Consider upgrading to paid plan for production use

### Vercel Free Tier
- Unlimited bandwidth
- Automatic HTTPS
- Perfect for frontend hosting

### MongoDB Atlas Free Tier
- 512 MB storage
- Shared cluster
- Sufficient for testing and small projects

### CORS Configuration
The backend is already configured to accept requests from any origin (`origin: '*'`). This is fine for development but consider restricting it in production:

```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

---

## Troubleshooting

### Backend Issues
- **503 Error:** Backend is waking up from sleep (wait 30-60 seconds)
- **Connection Error:** Check MongoDB connection string
- **Auth Error:** Verify JWT_SECRET is set

### Frontend Issues
- **API Error:** Verify backend URL is correct
- **CORS Error:** Check backend CORS configuration
- **Build Error:** Check all dependencies are installed

### Mobile App Issues
- **Login Failed:** Verify backend URL in api.js
- **Network Error:** Check internet connection
- **APK Not Installing:** Enable "Install from Unknown Sources"

---

## Next Steps

1. Deploy backend on Render
2. Deploy frontend on Vercel
3. Test both deployments
4. Update mobile app with production URLs
5. Rebuild APK
6. Test APK on physical device
7. Create GitHub release with APK

**Once you have the URLs, share them and I'll help you update the configuration and create the release!**
