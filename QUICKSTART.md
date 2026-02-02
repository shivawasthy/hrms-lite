# Quick Start Guide

Get HRMS Lite running in minutes!

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm 9+

## 🚀 Fastest Way (Automated Setup)

### Linux/Mac
```bash
git clone <your-repo-url>
cd hrms-lite
chmod +x setup.sh
./setup.sh
```

### Windows
```bash
git clone <your-repo-url>
cd hrms-lite
setup.bat
```

Then:
1. Open Terminal 1 → Start backend
2. Open Terminal 2 → Start frontend
3. Visit http://localhost:3000

## 📝 Manual Setup (5 Minutes)

### Step 1: Backend (Terminal 1)

```bash
cd backend
python -m venv venv

# Activate venv
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate     # Windows

pip install -r requirements.txt
python main.py
```

✅ Backend running at http://localhost:8000

### Step 2: Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at http://localhost:3000

## 🎯 First Steps

1. **Visit Dashboard**: http://localhost:3000
2. **Add Employee**: Click "Employees" → "Add Employee"
3. **Mark Attendance**: Click "Attendance" → "Mark Attendance"
4. **View Stats**: Return to Dashboard to see statistics

## 📚 Usage Tips

### Adding Employees
- Employee ID must be unique (e.g., EMP001, EMP002)
- Email must be valid and unique
- All fields are required

### Marking Attendance
- Select employee from dropdown
- Choose date (cannot be future date)
- Select status: Present or Absent
- One record per employee per day

### Filtering
- Filter attendance by employee or date
- Use "Clear Filters" to reset

## 🌐 Deployment Checklist

### Backend (Render/Railway)
- [ ] Create web service
- [ ] Set root directory: `backend`
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Copy deployed URL

### Frontend (Vercel/Netlify)
- [ ] Create new site
- [ ] Set root directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Add environment variable: `VITE_API_URL` = [Backend URL]
- [ ] Deploy

### After Deployment
- [ ] Update backend CORS with frontend domain
- [ ] Test all features on live site
- [ ] Share live URLs

## ❓ Common Issues

**Backend won't start**
- Check Python version: `python --version` (need 3.10+)
- Activate virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`

**Frontend won't start**
- Check Node version: `node --version` (need 18+)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

**API connection fails**
- Verify backend is running on port 8000
- Check `.env` file in frontend
- Try: `curl http://localhost:8000/` (should return JSON)

**Database errors**
- Delete `hrms.db` in backend folder
- Restart backend (database recreates automatically)

## 🔗 Useful Links

- Backend API Docs: http://localhost:8000/docs
- Frontend: http://localhost:3000
- Full README: [README.md](./README.md)

## 🆘 Need Help?

1. Check error messages in terminal
2. Review browser console (F12)
3. Verify all prerequisites are installed
4. Try the automated setup script
5. Read full documentation in README.md

---

**Ready to deploy?** See `backend/DEPLOYMENT.md` and `frontend/DEPLOYMENT.md`
