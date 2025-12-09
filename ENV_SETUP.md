# Environment Variables Configuration Guide

This project uses environment variables to manage configuration settings for both the backend and frontend applications.

## Backend Configuration

### Location
`back-end/.env`

### Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://username:password@cluster.mongodb.net/database` |
| `JWT_SECRET` | Secret key for JWT token generation | `your_secret_key_here` |
| `PORT` | Port number for the backend server | `5000` |

### Setup
1. Copy `back-end/.env.example` to `back-end/.env`
2. Update the values with your actual credentials
3. Never commit `.env` to version control

## Frontend Configuration

### Location
`book_nest/.env.local`

### Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH_SECRET` | Authentication secret key | `your_auth_secret_here` |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000` |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | `ws://localhost:5000` |

### Setup
1. Copy `book_nest/.env.example` to `book_nest/.env.local`
2. Update the URLs if your backend runs on a different host/port
3. The `NEXT_PUBLIC_` prefix makes these variables accessible in the browser

## Development vs Production

### Development
- Use `localhost` URLs for local development
- Default port is `5000` for the backend

### Production
Update the environment variables to use production URLs:

**Backend (`.env`):**
```env
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_production_secret
PORT=5000
```

**Frontend (`.env.local` or `.env.production`):**
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_WS_URL=wss://your-api-domain.com
```

## Docker Configuration

If using Docker, environment variables can be set in `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - PORT=5000
  
  frontend:
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
      - NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}
```

## Security Best Practices

1. **Never commit `.env` or `.env.local` files** to version control
2. Add them to `.gitignore`
3. Use strong, unique secrets for `JWT_SECRET` and `AUTH_SECRET`
4. Rotate secrets regularly in production
5. Use different credentials for development and production
6. For production, consider using a secrets management service (AWS Secrets Manager, Azure Key Vault, etc.)

## Troubleshooting

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check if the backend server is running
- Ensure CORS is properly configured in the backend

### WebSocket connection fails
- Verify `NEXT_PUBLIC_WS_URL` is correct
- Ensure WebSocket server is running on the backend
- Check firewall settings

### Environment variables not updating
- Restart the development server after changing `.env` files
- For Next.js, environment variables are bundled at build time
- Clear `.next` cache if needed: `rm -rf .next`
