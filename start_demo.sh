#!/bin/bash

# =======================================================
# ONE-CLICK LOCALHOST LAUNCHER FOR FINAL YEAR PROJECT
# Criminal Investigation Tracker with AI Video Generation
# =======================================================

echo ""
echo "======================================================="
echo " 🚀 Criminal Investigation Tracker — Localhost Launcher"
echo "======================================================="
echo ""

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Kill any old instances first
pkill -f "uvicorn" 2>/dev/null
pkill -f "main:app" 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null
sleep 1

# 1. Check MongoDB
echo "📦 Checking MongoDB..."
if pgrep -x mongod > /dev/null 2>&1; then
  echo "   ✅ MongoDB is already running"
else
  echo "   ⚠️  MongoDB not detected. Attempting to start..."
  brew services start mongodb-community@8.0 2>/dev/null || brew services start mongodb-community 2>/dev/null || echo "   (Start MongoDB manually if needed)"
  sleep 3
  if pgrep -x mongod > /dev/null 2>&1; then
    echo "   ✅ MongoDB started successfully"
  else
    echo "   ℹ️  MongoDB may not be running — project has JSON file fallback, so it will still work."
  fi
fi

# 2. Start FastAPI Backend
echo ""
echo "⚙️  Starting Backend Server (FastAPI on port 8000)..."
cd "$PROJECT_DIR/backend"
source venv/bin/activate
python3 main.py > /tmp/backend_fyp.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Verify backend started
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
  echo "   ✅ Backend is running — http://localhost:8000"
else
  echo "   ⚠️  Backend may be slow to start. Check /tmp/backend_fyp.log if issues."
fi

# 3. Start React Frontend
echo ""
echo "🌐 Starting Frontend Server (React on port 3000)..."
cd "$PROJECT_DIR/frontend"
npm run dev > /tmp/frontend_fyp.log 2>&1 &
FRONTEND_PID=$!
sleep 4

echo ""
echo "======================================================="
echo " ✅ BOTH SERVERS ARE LIVE!"
echo ""
echo "   🌐 Open this in browser → http://localhost:3000"
echo "   ⚙️  Backend API           → http://localhost:8000"
echo ""
echo "   Login Credentials:"
echo "   ┌────────────────┬───────────────┬──────────────────┐"
echo "   │ Role           │ Username      │ Password         │"
echo "   ├────────────────┼───────────────┼──────────────────┤"
echo "   │ Investigator   │ investigator  │ investigator@123 │"
echo "   │ Police Officer │ officer       │ officer@456      │"
echo "   │ Commissioner   │ commissioner  │ commissioner@789 │"
echo "   └────────────────┴───────────────┴──────────────────┘"
echo ""
echo " Press CTRL+C to stop both servers."
echo "======================================================="
echo ""

# Open browser automatically
open "http://localhost:3000"

# Handle CTRL+C gracefully
cleanup() {
  echo ""
  echo "🛑 Stopping servers..."
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  echo "   Done. Servers stopped."
  exit 0
}
trap cleanup SIGINT SIGTERM

# Keep script running
wait $BACKEND_PID $FRONTEND_PID
