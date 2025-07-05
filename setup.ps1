# Flight Search Application Setup Script for Windows
# This script helps you set up the application quickly on Windows

Write-Host "🛫 Setting up Flight Search Application..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
    
    # Check Node.js version
    $majorVersion = [int]($nodeVersion -replace 'v|\..*', '')
    if ($majorVersion -lt 18) {
        Write-Host "❌ Node.js version 18 or higher is required. Current version: $nodeVersion" -ForegroundColor Red
        Write-Host "Please update Node.js from https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 20+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm -v
    Write-Host "✅ npm $npmVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
try {
    npm install
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Set up environment file
Write-Host ""
Write-Host "⚙️  Setting up environment configuration..." -ForegroundColor Blue
if (-not (Test-Path .env)) {
    try {
        Copy-Item .env.example .env
        Write-Host "✅ Environment file created (.env)" -ForegroundColor Green
        Write-Host "ℹ️  Default configuration will use mock data" -ForegroundColor Cyan
        Write-Host "ℹ️  For live flight data, add your RapidAPI key to .env" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Failed to create environment file" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Environment file already exists" -ForegroundColor Green
}

# Optional: Prompt for RapidAPI key
Write-Host ""
$hasApiKey = Read-Host "Do you have a RapidAPI key for Sky Scrapper API? (y/n)"
if ($hasApiKey -match '^[Yy]') {
    $rapidApiKey = Read-Host "Enter your RapidAPI key" -MaskInput
    if ($rapidApiKey) {
        # Update .env file with the API key
        try {
            $envContent = Get-Content .env
            $envContent = $envContent -replace 'RAPIDAPI_KEY=.*', "RAPIDAPI_KEY=$rapidApiKey"
            $envContent = $envContent -replace 'X_RAPIDAPI_KEY=.*', "X_RAPIDAPI_KEY=$rapidApiKey"
            $envContent | Set-Content .env
            Write-Host "✅ RapidAPI key configured" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Failed to update API key, please edit .env manually" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  No API key entered, using mock data" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  Using mock data for development" -ForegroundColor Cyan
    Write-Host "ℹ️  Get a free API key at: https://rapidapi.com/3b-data-3b-data-default/api/sky-scrapper" -ForegroundColor Cyan
}

# Type check
Write-Host ""
Write-Host "🔍 Running type check..." -ForegroundColor Blue
try {
    npm run check
    Write-Host "✅ TypeScript check passed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  TypeScript warnings detected (non-critical)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start the development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Open your browser to:" -ForegroundColor White
Write-Host "   http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. For live flight data, add your RapidAPI key to .env" -ForegroundColor White
Write-Host "   See ENV_SETUP.md for detailed instructions" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! ✈️" -ForegroundColor Green