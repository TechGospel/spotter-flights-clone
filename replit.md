# Flight Search Application

## Overview

This is a responsive, mobile-friendly flight search interface built with React.js that mirrors the Google Flights UI. The application integrates with the Sky Scrapper API on RapidAPI to provide real-time flight search functionality with features like location autocomplete, round-trip flight searches, and detailed flight information display.

## System Architecture

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
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot module replacement via Vite middleware

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Fallback Storage**: In-memory storage implementation for development

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

### Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Connection**: Via @neondatabase/serverless adapter
- **Environment Variable**: DATABASE_URL for connection string

### Development Tools
- **Replit Integration**: Cartographer plugin for development environment
- **Error Handling**: Runtime error overlay for development debugging

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React application to static assets
2. **Backend Build**: ESBuild bundles server code with external dependencies
3. **Database Setup**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: `NODE_ENV=development` with Vite dev server
- **Production**: `NODE_ENV=production` with static file serving
- **API Keys**: RAPIDAPI_KEY or X_RAPIDAPI_KEY environment variables

### File Structure
```
/client - React frontend application
/server - Express.js backend server
/shared - Shared schemas and types
/migrations - Database migration files
/dist - Built application output
```

### Scripts
- `dev`: Start development server with hot reload
- `build`: Build both frontend and backend for production
- `start`: Run production server
- `db:push`: Apply database schema changes

## Changelog
- July 03, 2025. Added comprehensive documentation and setup automation
  - Created detailed README.md with complete setup instructions
  - Added automated setup scripts for Linux/Mac (setup.sh) and Windows (setup.ps1)
  - Created environment configuration files (.env.example, ENV_SETUP.md)
  - Added QUICK_START.md for immediate development setup
  - Updated .gitignore for proper environment variable security
  - Added MIT license for open source distribution
- July 03, 2025. Fixed HTTP 304 status code handling in both frontend and backend
  - Updated frontend query client to accept 304 responses as valid
  - Enhanced server endpoint error handling for cached responses
  - Resolved airport search display issues with cached data
  - Redesigned flight card layout to match Google Flights UI
- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.