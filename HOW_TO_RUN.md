# 🚀 How to Run This Project (For Thursday Review)

Everything is saved on your laptop. You don't need me or any internet tool. Just follow these steps:

---

## Step 1: MongoDB (Usually Already Running)

MongoDB is already installed on your Mac and **auto-starts on boot** — you probably don't need to do anything. The start script checks this for you automatically.

If for some reason it's not running, open Terminal and type:
```
brew services start mongodb-community@8.0
```

---

## Step 2: Run the Project (One Command)

Open **Terminal** and type:
```
cd ~/Desktop/"FINAL YEAR PROJECT"
./start_demo.sh
```

That's it! It will:
- Start the Backend server (port 8000)
- Start the Frontend server (port 3000)
- Automatically open http://localhost:3000 in your browser

---

## Step 3: Login & Demo

| Role           | Username       | Password |
|----------------|----------------|----------|
| Investigator   | investigator   | inv123   |
| Police Officer | officer        | off123   |
| Commissioner   | commissioner   | com123   |

Click a role → credentials auto-fill → click Sign In.

---

## Step 4: Stop the Servers When Done

Press **CTRL + C** in the Terminal where you ran the script.

---

## Demo Flow for Review

1. **Login as Investigator** → See dashboard with case stats
2. **Click "New Case"** → Pre-filled data, just click Next → Next → Save
3. **Watch the auto-generated crime reconstruction video** with audio narration
4. **Go back** → **Login as Officer** → Verify evidence → Submit findings
5. **Login as Commissioner** → Review case → Approve or Reject

---

## If Something Goes Wrong

### "Port already in use" error
```
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```
Then run `./start_demo.sh` again.

### "MongoDB connection failed"
```
brew services restart mongodb-community
```
Wait 5 seconds, then run `./start_demo.sh` again.

### "Module not found" error (backend)
```
cd ~/Desktop/"FINAL YEAR PROJECT"/backend
source venv/bin/activate
pip install -r requirements.txt
```

### "Module not found" error (frontend)
```
cd ~/Desktop/"FINAL YEAR PROJECT"/frontend
npm install
```

---

## Project Location

All your code is at:
```
~/Desktop/FINAL YEAR PROJECT/
├── backend/          ← Python FastAPI server
│   ├── main.py
│   ├── services/
│   │   ├── video_engine.py    ← Crime video generator
│   │   ├── mongo_service.py   ← MongoDB connection
│   │   └── ...
│   └── venv/         ← Python virtual environment
├── frontend/         ← React UI
│   ├── src/App.jsx   ← Main UI code
│   └── ...
└── start_demo.sh     ← One-click launcher
```

**Good luck on your review! 🎓**
