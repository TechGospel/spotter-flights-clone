# Environment Variables Setup

This document explains how to configure environment variables for the Flight Search Application.

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual values (see sections below)

## Required Environment Variables

### RapidAPI Configuration (Required for Live Data)

To get real flight and airport data, you need a RapidAPI key for the Sky Scrapper API:

1. Visit [Sky Scrapper API on RapidAPI](https://rapidapi.com/apiheya/api/sky-scrapper)
2. Subscribe to the API (free tier available)
3. Copy your API key
4. Add it to your `.env` file:
   ```
   RAPIDAPI_KEY=your_actual_api_key_here
   X_RAPIDAPI_KEY=your_actual_api_key_here
   ```

**Note**: Without a valid API key, the application will use mock data for development.


## Optional Environment Variables 

### Application Settings
```
NODE_ENV=production          # Set to 'production' for deployment
PORT=5000                   # Server port (default: 5000)
HOST=0.0.0.1               # Server host (default: 0.0.0.1)
```

### Security Settings
```
SESSION_SECRET=your_secure_random_string_here  # For session encryption
ALLOWED_ORIGINS=https://yourdomain.com         # CORS origins for production
```

### Development Settings
```
LOG_LEVEL=debug             # Logging level (debug, info, warn, error)
RATE_LIMIT_REQUESTS_PER_MINUTE=100  # API rate limiting
```

## Troubleshooting

### API Rate Limiting
If you see 429 (rate limited) errors:
- Check your RapidAPI subscription limits
- Consider upgrading your plan for higher rate limits
- The app will fall back to mock data when rate limited