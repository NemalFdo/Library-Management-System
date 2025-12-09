# Quick Start Guide - Environment Variables

## Setup Instructions

### 1. Backend Setup
```bash
cd back-end
cp .env.example .env
# Edit .env with your actual values
npm install
npm start
```

### 2. Frontend Setup
```bash
cd book_nest
cp .env.example .env.local
# Edit .env.local if needed (defaults should work for local development)
npm install
npm run dev
```

## Default Configuration (Development)

Your project is now configured to use environment variables!

### Backend (back-end/.env)
- ✅ Already configured with your MongoDB credentials
- ✅ PORT=5000 added

### Frontend (book_nest/.env.local)
- ✅ NEXT_PUBLIC_API_URL=http://localhost:5000
- ✅ NEXT_PUBLIC_WS_URL=ws://localhost:5000

## What Changed?

All hardcoded URLs like:
- ❌ `"http://localhost:5000/api/books"`
- ❌ `"ws://localhost:5000"`

Are now using environment variables:
- ✅ `${API_URL}/api/books`
- ✅ `WS_URL`

## Testing

After starting both servers:

1. **Backend**: http://localhost:5000
2. **Frontend**: http://localhost:3000

All API calls and WebSocket connections will automatically use the configured URLs.

## For Production

Update the environment variables in production:

**Backend:**
```env
MONGO_URI=your_production_mongodb
JWT_SECRET=strong_production_secret
PORT=5000
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
```

## Need Help?

See `ENV_SETUP.md` for detailed documentation.
