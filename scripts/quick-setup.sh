#!/bin/bash

echo "🚀 Setting up Reddit Clone with PostgreSQL..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Start PostgreSQL with Docker
echo "📦 Starting PostgreSQL with Docker..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/reddit_clone"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# GitHub OAuth (you need to fill these)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
EOF
    echo "✅ .env file created. Please update GitHub OAuth credentials."
else
    echo "✅ .env file already exists."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run migrations
echo "🗄️ Running database migrations..."
npx prisma migrate dev

# Seed database
echo "🌱 Seeding database..."
npm run seed

echo "✅ Setup complete! Run 'npm run dev' to start the development server."
echo "📊 You can view your database with 'npm run db:studio'"
