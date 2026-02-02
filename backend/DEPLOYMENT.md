# Backend Deployment Guide

## Deploy to Render

1. **Create Account**: Sign up at [render.com](https://render.com)

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**:
   - **Name**: `hrms-lite-backend`
   - **Region**: Choose nearest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables**: None required for SQLite

5. **Deploy**: Click "Create Web Service"

6. **Get URL**: After deployment, copy the URL (e.g., `https://hrms-lite-backend.onrender.com`)

## Deploy to Railway

1. **Create Account**: Sign up at [railway.app](https://railway.app)

2. **New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**:
   - **Root Directory**: `backend`
   - Railway auto-detects Python and installs dependencies
   - **Start Command**: Add in Settings → `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Deploy**: Railway automatically deploys

5. **Get URL**: Click "Generate Domain" in Settings

## Deploy to Fly.io

1. **Install Fly CLI**:
```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login**:
```bash
fly auth login
```

3. **Create fly.toml** in backend directory:
```toml
app = "hrms-lite-backend"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8080"

[[services]]
  http_checks = []
  internal_port = 8080
  processes = ["app"]
  protocol = "tcp"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

4. **Deploy**:
```bash
cd backend
fly launch
fly deploy
```

## Important Notes

- For production, consider using PostgreSQL instead of SQLite
- Update CORS origins in `main.py` to your frontend domain
- Monitor logs for any issues after deployment
