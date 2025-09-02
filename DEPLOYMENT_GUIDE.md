# Deployment Guide

## Backend Deployment on Render

### Step 1: Create a New Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository: `souptiksarkar893/School-Management-System`
4. Configure the service:
   - **Name**: `school-management-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (it will use the root)

### Step 2: Set Environment Variables on Render
Go to your service's Environment tab and add these variables:

```
DATABASE_URL=your_mysql_database_url_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
FRONTEND_URL=https://your-netlify-app.netlify.app
```

### Step 3: Deploy
Click "Create Web Service" and wait for deployment to complete.

---

## Frontend Deployment on Netlify

### Step 1: Create a New Site on Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository: `souptiksarkar893/School-Management-System`
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### Step 2: Set Environment Variables on Netlify
Go to Site settings → Environment variables and add:

```
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

### Step 3: Deploy
Click "Deploy site" and wait for deployment to complete.

---

## Post-Deployment Steps

### 1. Update CORS Configuration
After both deployments are complete:
1. Note your Netlify URL (e.g., `https://amazing-app-123.netlify.app`)
2. Update the `FRONTEND_URL` environment variable on Render with your Netlify URL
3. Redeploy the backend service on Render

### 2. Test Your Deployment
1. Visit your Netlify site
2. Try adding a school to test the full functionality
3. Check browser console for any CORS or API errors

---

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `FRONTEND_URL` on Render matches your Netlify URL exactly
2. **API Not Found**: Check that `VITE_API_URL` on Netlify points to your Render backend URL
3. **Database Errors**: Verify your `DATABASE_URL` is correct and the database is accessible
4. **Build Failures**: Check the build logs on both platforms for specific error messages

### Useful Commands for Local Testing:
```bash
# Test backend locally
cd backend && npm start

# Test frontend build locally
cd frontend && npm run build && npm run preview
```

---

## URLs to Remember:
- **Backend**: https://your-app-name.onrender.com
- **Frontend**: https://your-app-name.netlify.app
- **API Health Check**: https://your-app-name.onrender.com/health
