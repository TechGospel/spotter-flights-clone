# Quick Start Guide

Get the Flight Search Application running in under 5 minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))

## Installation

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <your-repository-url>
cd flight-search-app

# Run the setup script
chmod +x setup.sh
./setup.sh

# Start the application
npm run dev
```

### Option 2: Manual Setup

```bash
# Clone and install
git clone <your-repository-url>
cd flight-search-app
npm install

# Set up environment
cp .env.example .env

# Start development server
npm run dev
```

### Windows Users

Use PowerShell:
```powershell
# After cloning the repository
powershell -ExecutionPolicy Bypass -File setup.ps1
npm run dev
```

## Access the Application

Open your browser to: **http://localhost:5000**
