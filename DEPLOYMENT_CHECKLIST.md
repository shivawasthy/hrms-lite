# HRMS Lite - Deployment Checklist

Use this checklist to ensure successful deployment and submission.

## ✅ Pre-Deployment Checklist

### Code Quality
- [ ] All components working locally
- [ ] No console errors in browser
- [ ] No Python errors in backend
- [ ] Forms validate correctly
- [ ] Error messages are user-friendly
- [ ] Loading states display properly
- [ ] Empty states show when no data

### Testing
- [ ] Can add employee
- [ ] Can delete employee
- [ ] Can mark attendance
- [ ] Can delete attendance
- [ ] Filters work correctly
- [ ] Dashboard shows correct statistics
- [ ] Duplicate employee ID is prevented
- [ ] Duplicate email is prevented
- [ ] Duplicate attendance (same day) is prevented

### Documentation
- [ ] README.md is complete
- [ ] Tech stack is documented
- [ ] Setup instructions are clear
- [ ] API endpoints are documented
- [ ] Assumptions are listed

## 🚀 Backend Deployment

### Render Deployment
- [ ] Create Render account
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Configure settings:
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `pip install -r requirements.txt`
  - [ ] Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Deploy and wait for success
- [ ] Test API: Visit `https://your-backend.onrender.com/`
- [ ] Test Swagger docs: Visit `https://your-backend.onrender.com/docs`
- [ ] Copy backend URL for frontend

### Alternative: Railway
- [ ] Create Railway account
- [ ] New Project from GitHub
- [ ] Set root directory: `backend`
- [ ] Configure start command
- [ ] Generate domain
- [ ] Copy URL

## 🎨 Frontend Deployment

### Vercel Deployment
- [ ] Create Vercel account
- [ ] Import project from GitHub
- [ ] Configure settings:
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] Add environment variable:
  - [ ] Name: `VITE_API_URL`
  - [ ] Value: `https://your-backend-url.onrender.com`
- [ ] Deploy and wait for success
- [ ] Visit deployed URL
- [ ] Copy frontend URL

### Alternative: Netlify
- [ ] Create Netlify account
- [ ] Import from GitHub
- [ ] Set base directory: `frontend`
- [ ] Set build directory: `frontend/dist`
- [ ] Add VITE_API_URL environment variable
- [ ] Deploy

## 🔧 Post-Deployment Configuration

### Update Backend CORS
- [ ] Edit `backend/main.py`
- [ ] Update `allow_origins` with your frontend URL:
```python
allow_origins=[
    "https://your-frontend.vercel.app",
    "http://localhost:3000"
]
```
- [ ] Commit and push changes
- [ ] Wait for backend redeployment

### Verification
- [ ] Visit frontend URL
- [ ] Check browser console (F12) - no errors
- [ ] Add test employee
- [ ] Mark test attendance
- [ ] View dashboard
- [ ] All features working

## 📦 GitHub Repository

### Repository Setup
- [ ] Create new GitHub repository
- [ ] Repository is public or access is granted
- [ ] README.md is in root
- [ ] .gitignore is configured
- [ ] No sensitive data committed (.env, .db files)

### Commit History
- [ ] Initial commit with all code
- [ ] Meaningful commit messages
- [ ] No large files or dependencies

### Repository Structure
```
hrms-lite/
├── .github/
│   └── workflows/
├── backend/
├── frontend/
├── README.md
├── QUICKSTART.md
├── .gitignore
└── setup.sh/setup.bat
```

## 📝 Final Submission

### Required Information
- [ ] Live Frontend URL (working)
- [ ] Live Backend URL (working)
- [ ] GitHub Repository URL (accessible)
- [ ] README.md contains:
  - [ ] Project overview
  - [ ] Tech stack
  - [ ] Setup instructions
  - [ ] Deployment links
  - [ ] Assumptions/limitations

### Testing Submission
- [ ] Open frontend URL in incognito window
- [ ] Test complete workflow:
  1. [ ] Add employee
  2. [ ] Mark attendance
  3. [ ] View dashboard
  4. [ ] Filter attendance
  5. [ ] Delete records
- [ ] Check that API calls work
- [ ] Verify no errors in console

### Final Checks
- [ ] All links work
- [ ] API documentation accessible
- [ ] No broken features
- [ ] Forms validate properly
- [ ] Error handling works
- [ ] UI is responsive on mobile

## 🎯 Submission Form

When submitting, provide:

1. **Live Application URL**: `https://your-frontend.vercel.app`
2. **GitHub Repository**: `https://github.com/yourusername/hrms-lite`
3. **Backend API URL** (optional): `https://your-backend.onrender.com`

## ⚠️ Common Pitfalls to Avoid

- [ ] Don't commit .env files
- [ ] Don't commit database files
- [ ] Don't leave CORS as allow_origins=["*"] in production
- [ ] Don't forget to set VITE_API_URL environment variable
- [ ] Don't submit with broken links
- [ ] Don't submit without testing deployed version
- [ ] Don't forget to update README with actual URLs

## 🆘 Troubleshooting

### Backend Not Working
- Check logs in Render/Railway dashboard
- Verify start command is correct
- Test API directly: curl `https://your-backend.onrender.com/`

### Frontend Not Connecting to Backend
- Check VITE_API_URL is set correctly
- Verify backend CORS settings
- Check browser console for errors
- Test API from browser: visit `https://your-backend.onrender.com/docs`

### Build Failures
- Check build logs
- Verify Node/Python versions
- Check for missing dependencies
- Test build locally first

## ✅ Success Criteria

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ Can create employees
- ✅ Can mark attendance  
- ✅ Dashboard displays correct data
- ✅ Filters work
- ✅ All CRUD operations functional
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Professional UI/UX

---

**Ready to submit?** Double-check all items above! 🚀
