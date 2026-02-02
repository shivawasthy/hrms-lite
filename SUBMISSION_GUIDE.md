# 📤 Submission Guide - HRMS Lite

This guide will walk you through submitting your HRMS Lite project.

## 🎯 What You Need to Submit

1. **Live Application URL** (Frontend)
2. **GitHub Repository URL** (Public)
3. **README.md** (Already included)

## 📋 Step-by-Step Submission Process

### Step 1: Deploy Backend (15 minutes)

#### Using Render (Recommended)

1. **Sign up** at https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select your repository
5. **Configure**:
   ```
   Name: hrms-lite-backend
   Region: Oregon (or nearest)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
6. Click **"Create Web Service"**
7. Wait 3-5 minutes for deployment
8. **Test**: Click your backend URL, should show:
   ```json
   {"message": "HRMS Lite API", "version": "1.0.0"}
   ```
9. **Copy URL**: Save this for frontend (e.g., `https://hrms-lite-backend.onrender.com`)

### Step 2: Deploy Frontend (10 minutes)

#### Using Vercel (Recommended)

1. **Sign up** at https://vercel.com
2. Click **"Add New"** → **"Project"**
3. **Import** your GitHub repository
4. **Configure**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
5. **Environment Variables** - Click "Add":
   ```
   Name: VITE_API_URL
   Value: [Your backend URL from Step 1]
   Example: https://hrms-lite-backend.onrender.com
   ```
6. Click **"Deploy"**
7. Wait 2-3 minutes
8. **Test**: Click your frontend URL
9. **Verify**: Try adding an employee

### Step 3: Update Backend CORS (5 minutes)

1. Go to your backend code on GitHub
2. Edit `backend/main.py`
3. Find `allow_origins`:
   ```python
   allow_origins=["*"]  # Change this
   ```
4. Update to:
   ```python
   allow_origins=[
       "https://your-frontend-url.vercel.app",  # Your actual URL
       "http://localhost:3000"  # Keep for local dev
   ]
   ```
5. Commit and push
6. Render will auto-redeploy

### Step 4: Final Testing (5 minutes)

Open your **deployed frontend** and test:

1. ✅ **Add Employee**
   - Click "Employees" → "Add Employee"
   - Fill form: ID: `EMP001`, Name: `John Doe`, Email: `john@test.com`, Dept: `Engineering`
   - Submit and verify it appears in the table

2. ✅ **Mark Attendance**
   - Click "Attendance" → "Mark Attendance"
   - Select employee, today's date, status "Present"
   - Submit and verify it appears

3. ✅ **View Dashboard**
   - Click "Dashboard"
   - Verify statistics show: 1 employee, 1 present

4. ✅ **Filter Attendance**
   - Go to Attendance page
   - Use filters to filter by employee
   - Verify it works

5. ✅ **Check Console**
   - Press F12 (browser dev tools)
   - Check Console tab
   - Should have NO red errors

### Step 5: Prepare Repository (3 minutes)

1. Ensure your GitHub repo has:
   - ✅ All source code
   - ✅ README.md in root
   - ✅ .gitignore configured
   - ✅ No .env files committed
   - ✅ No .db files committed

2. Update README.md with your actual URLs:
   ```markdown
   ## 🚀 Live Demo
   
   - **Frontend**: https://your-app.vercel.app
   - **Backend API**: https://your-backend.onrender.com
   - **API Docs**: https://your-backend.onrender.com/docs
   ```

3. Commit and push:
   ```bash
   git add README.md
   git commit -m "Update README with deployment URLs"
   git push
   ```

### Step 6: Submit (2 minutes)

Fill out the submission form with:

1. **Live Application URL**:
   ```
   https://hrms-lite-frontend.vercel.app
   ```

2. **GitHub Repository**:
   ```
   https://github.com/yourusername/hrms-lite
   ```

3. Click **Submit** 🎉

## ✅ Pre-Submission Checklist

Before submitting, verify:

### Deployment
- [ ] Backend is deployed and accessible
- [ ] Frontend is deployed and accessible
- [ ] API calls work (check browser console)
- [ ] Can add employee successfully
- [ ] Can mark attendance successfully
- [ ] Dashboard shows correct data
- [ ] No console errors

### Repository
- [ ] Code is pushed to GitHub
- [ ] Repository is public (or access granted)
- [ ] README.md has deployment URLs
- [ ] .gitignore is configured
- [ ] No sensitive files committed

### Testing
- [ ] Tested in incognito/private window
- [ ] Tested on mobile device
- [ ] All CRUD operations work
- [ ] Forms validate correctly
- [ ] Error messages display properly

## 🚨 Common Issues & Solutions

### Issue: API Calls Failing

**Symptom**: Frontend loads but buttons don't work
**Solution**:
1. Check browser console (F12)
2. Look for CORS errors
3. Verify VITE_API_URL is set correctly in Vercel
4. Verify backend CORS allows your frontend domain

### Issue: Backend Not Responding

**Symptom**: Backend URL shows error
**Solution**:
1. Check Render logs for errors
2. Verify start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Check if all dependencies installed
4. Try redeploying

### Issue: Build Failed

**Symptom**: Deployment shows build error
**Solution**:
1. Check build logs
2. Verify package.json/requirements.txt
3. Test build locally first:
   - Backend: `pip install -r requirements.txt`
   - Frontend: `npm run build`

### Issue: 404 on Routes

**Symptom**: Refreshing page shows 404
**Solution** (Vercel):
1. Settings → Redirects/Rewrites
2. Add: Source `/*` → Destination `/index.html`

## 📞 Getting Help

If you encounter issues:

1. **Check Logs**:
   - Render: Dashboard → Logs
   - Vercel: Deployments → Build logs
   - Browser: F12 → Console tab

2. **Review Documentation**:
   - README.md
   - QUICKSTART.md
   - DEPLOYMENT_CHECKLIST.md

3. **Test Locally First**:
   - Run both servers locally
   - Verify everything works
   - Then deploy

## 🎯 Success Criteria

Your submission is ready when:

✅ Frontend URL loads without errors
✅ Can see the dashboard
✅ Can add a new employee
✅ Can mark attendance
✅ Dashboard updates with new data
✅ No errors in browser console
✅ GitHub repository is accessible
✅ README has deployment URLs

## 🎉 Final Checklist

Right before submitting:

- [ ] Open frontend URL in private/incognito window
- [ ] Add test employee: "Test User"
- [ ] Mark attendance for test employee
- [ ] Check dashboard shows 1 employee, 1 present
- [ ] No errors in console (F12)
- [ ] Mobile view works
- [ ] GitHub repo is public
- [ ] README has correct URLs

---

## 📝 Example Submission

**Live Application URL:**
```
https://hrms-lite.vercel.app
```

**GitHub Repository URL:**
```
https://github.com/yourname/hrms-lite
```

That's it! You're ready to submit. Good luck! 🚀

---

**Need more help?** See DEPLOYMENT_CHECKLIST.md for detailed troubleshooting.
