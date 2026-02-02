# Frontend Deployment Guide

## Deploy to Vercel

1. **Create Account**: Sign up at [vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel auto-detects the frontend

3. **Configure**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**:
   - Add `VITE_API_URL`: Your deployed backend URL
   - Example: `https://hrms-lite-backend.onrender.com`

5. **Deploy**: Click "Deploy"

6. **Custom Domain** (Optional): Add in Settings → Domains

## Deploy to Netlify

1. **Create Account**: Sign up at [netlify.com](https://netlify.com)

2. **Add New Site**:
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository

3. **Configure Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

4. **Environment Variables**:
   - Go to Site settings → Environment variables
   - Add `VITE_API_URL`: Your deployed backend URL

5. **Deploy**: Click "Deploy site"

## Deploy to Cloudflare Pages

1. **Create Account**: Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)

2. **Create Project**:
   - Click "Create a project"
   - Connect to GitHub
   - Select repository

3. **Configure**:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `frontend`

4. **Environment Variables**:
   - Add `VITE_API_URL`: Your backend URL

5. **Deploy**: Click "Save and Deploy"

## Post-Deployment Steps

1. **Update API URL**: Make sure `VITE_API_URL` points to your deployed backend

2. **Update Backend CORS**: In `backend/main.py`, update allowed origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-domain.vercel.app",
        "http://localhost:3000"  # Keep for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

3. **Test**: Open your deployed frontend URL and verify:
   - All pages load correctly
   - Can add employees
   - Can mark attendance
   - Dashboard shows correct data

## Troubleshooting

- **API calls failing**: Check that `VITE_API_URL` is set correctly
- **CORS errors**: Verify backend allows your frontend domain
- **Build fails**: Check build logs for missing dependencies
- **Blank page**: Check browser console for errors
