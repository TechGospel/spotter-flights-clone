#!/bin/bash

# Flight Search Application Setup Script
# This script helps you set up the application quickly

echo "🛫 Setting up Flight Search Application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    echo "Please update Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if npm install; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Set up environment file
echo ""
echo "⚙️  Setting up environment configuration..."
if [ ! -f .env ]; then
    if cp .env.example .env; then
        echo "✅ Environment file created (.env)"
        echo "ℹ️  Default configuration will use mock data"
        echo "ℹ️  For live flight data, add your RapidAPI key to .env"
    else
        echo "❌ Failed to create environment file"
        exit 1
    fi
else
    echo "✅ Environment file already exists"
fi

# Optional: Prompt for RapidAPI key
echo ""
read -p "Do you have a RapidAPI key for Sky Scrapper API? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your RapidAPI key: " -r RAPIDAPI_KEY
    if [ ! -z "$RAPIDAPI_KEY" ]; then
        # Update .env file with the API key
        sed -i.bak "s/RAPIDAPI_KEY=.*/RAPIDAPI_KEY=$RAPIDAPI_KEY/" .env
        sed -i.bak "s/X_RAPIDAPI_KEY=.*/X_RAPIDAPI_KEY=$RAPIDAPI_KEY/" .env
        rm .env.bak 2>/dev/null || true
        echo "✅ RapidAPI key configured"
    else
        echo "⚠️  No API key entered, using mock data"
    fi
else
    echo "ℹ️  Using mock data for development"
    echo "ℹ️  Get a free API key at: https://rapidapi.com/3b-data-3b-data-default/api/sky-scrapper"
fi

# Type check
echo ""
echo "🔍 Running type check..."
if npm run check; then
    echo "✅ TypeScript check passed"
else
    echo "⚠️  TypeScript warnings detected (non-critical)"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open your browser to:"
echo "   http://localhost:5000"
echo ""
echo "3. For live flight data, add your RapidAPI key to .env"
echo "   See ENV_SETUP.md for detailed instructions"
echo ""
echo "Happy coding! ✈️"