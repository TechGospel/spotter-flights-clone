# Flight Search Application

This is a responsive, mobile-friendly flight search interface built with React.js that mirrors the Google Flights UI. The application integrates with the Sky Scrapper API on RapidAPI to provide real-time flight search functionality with features like location autocomplete, round-trip flight searches, and detailed flight information display.

## Key Components

### Search Interface
- Multi-step search form with location autocomplete
- Date picker integration for departure/return dates
- Passenger and class selection dropdowns
- Trip type toggle (round-trip, one-way, multi-city)
- Real-time form validation using Zod schemas

### Flight Display
- Tabbed interface for sorting (Best, Cheapest, Quickest)
- Responsive flight cards with expandable details
- Filter system for stops, airlines, price, time, emissions
- Mobile-optimized collapsible flight information

### API Proxy Layer
- Airport search endpoint for location autocomplete
- Flight search endpoint for round-trip queries
- Search history tracking and storage
- Error handling and response transformation

## Data Flow

1. **User Input**: Form data collected via React Hook Form with Zod validation
2. **API Requests**: Client sends requests to Express.js proxy endpoints
3. **External API**: Server forwards requests to Sky Scrapper API with authentication
4. **Data Transformation**: Raw API responses transformed to match application schema
5. **State Management**: TanStack Query caches responses and manages loading states
6. **UI Updates**: React components re-render with new data and loading states

## External Dependencies

### Core APIs
- **Sky Scrapper API (RapidAPI)**: Primary flight data source
  - Airport search endpoint for autocomplete
  - Round-trip flight search functionality
  - Requires X-RapidAPI-Key authentication

## System Architecture & Tech Stack

### Frontend Architecture
- **Framework**: React.js with TypeScript
- **Styling**: TailwindCSS with utility-first responsive design
- **UI Components**: ShadCN/UI component library with Radix UI primitives
- **State Management**: React Hook Form for form validation and TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Integration**: RESTful endpoints proxying Sky Scrapper API
- **Development**: Hot module replacement via Vite middleware

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20 or higher** - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd flight-search-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

The application will work with default settings, but for live flight data, you'll need a RapidAPI key (see [Environment Setup](#environment-setup) below).

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Environment Setup

### Basic Setup (Using Mock Data)

The application works out of the box with mock data. No additional configuration required.

### Production Setup (Live Flight Data)

For real flight data, you need a RapidAPI key:

1. **Get RapidAPI Key**:
   - Visit [Sky Scrapper API](https://rapidapi.com/3b-data-3b-data-default/api/sky-scrapper)
   - Sign up and subscribe (free tier available)
   - Copy your API key

2. **Configure Environment**:
   ```bash
   # Edit .env file
   RAPIDAPI_KEY=your_actual_api_key_here
   X_RAPIDAPI_KEY=your_actual_api_key_here
   ```

3. **Optional Database Setup**:
   ```bash
   # For persistent data storage
   DATABASE_URL=postgresql://username:password@hostname:port/database_name
   ```

For detailed environment configuration, see [ENV_SETUP.md](ENV_SETUP.md).

## Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run check        # Type check TypeScript files

# Production
npm run build        # Build for production
npm run start        # Run production server

# Database
npm run db:push      # Apply database schema changes
```

## Project Structure

```
flight-search-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and API client
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # App entry point
│   └── index.html
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Storage interface
│   └── vite.ts            # Vite integration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Zod schemas and types
├── .env.example           # Environment variables template
├── ENV_SETUP.md          # Detailed environment setup
└── README.md             # This file
```

## API Endpoints

### Airport Search
```
GET /api/airports/search?query=<search_term>
```
Returns airports matching the search query.

### Flight Search
```
POST /api/flights/search
Content-Type: application/json

{
  "origin": "LOS",
  "destination": "LHR",
  "departureDate": "2025-07-15",
  "returnDate": "2025-07-22",
  "passengers": 1,
  "travelClass": "economy",
  "tripType": "round_trip"
}
```


### Responsive Design
Components automatically adapt to different screen sizes:
- Desktop: Full feature layout with horizontal flight cards
- Mobile: Compact vertical layout optimized for touch

### Mock Data Fallback
When API limits are reached or keys are missing, the app seamlessly falls back to comprehensive mock data for development.


## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process on port 5000
npx kill-port 5000
# Or change port in .env
PORT=3000
```

**API Rate Limiting**
- Check your RapidAPI subscription limits
- Application will use mock data when rate limited
- Consider upgrading RapidAPI plan for higher limits
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Commit with clear messages: `git commit -m "Add feature description"`
5. Push and create a Pull Request

## Acknowledgments

- [Sky Scrapper API](https://rapidapi.com/apiheya/api/sky-scrapper) for flight data
- [ShadCN/UI](https://ui.shadcn.com/) for component library
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Google Flights](https://flights.google.com/) for design inspiration
