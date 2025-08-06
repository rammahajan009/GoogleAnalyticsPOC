#!/bin/bash

# 🚀 Automated Release Script for GoogleAnalyticsPOC
# This script builds the APK, creates a git tag, and pushes to GitHub

set -e  # Exit on any error

echo "🚀 Starting automated release process..."

# Get version from command line or use default
VERSION=${1:-$(date +%Y%m%d)}
echo "📦 Version: $VERSION"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "📋 Checking prerequisites..."

# Check if git is available
if ! command -v git &> /dev/null; then
    print_error "Git is not installed"
    exit 1
fi

# Check if yarn is available
if ! command -v yarn &> /dev/null; then
    print_error "Yarn is not installed"
    exit 1
fi

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Please commit them first."
    git status --short
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

print_status "🧹 Cleaning previous builds..."
cd android
./gradlew clean
cd ..

print_status "📦 Installing dependencies..."
yarn install --frozen-lockfile

print_status "🔨 Building Android APK..."
cd android
export ANDROID_HOME=$HOME/Library/Android/sdk
./gradlew assembleDebug
cd ..

# Check if build was successful
if [ ! -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    print_error "Build failed! APK not found."
    exit 1
fi

print_success "✅ APK built successfully!"

# Copy APK to project root with version name
APK_NAME="GoogleAnalyticsPOC-v${VERSION}-debug.apk"
cp android/app/build/outputs/apk/debug/app-debug.apk "$APK_NAME"

print_status "📝 Creating git tag v$VERSION..."
git tag -a "v$VERSION" -m "Release v$VERSION - Multi-Project Google Analytics 4 Demo

Features:
- Multi-project analytics (India, US, UK)
- Generic analytics service
- SafeAreaView implementation
- TypeScript support
- Demo UI with event testing

Build: $(date)
APK: $APK_NAME"

print_status "🚀 Pushing to GitHub..."
git push origin main
git push origin "v$VERSION"

print_success "🎉 Release v$VERSION created successfully!"

echo ""
echo "📱 Release Information:"
echo "  Version: v$VERSION"
echo "  APK: $APK_NAME"
echo "  Size: $(ls -lh "$APK_NAME" | awk '{print $5}')"
echo ""
echo "🔗 GitHub Release URL:"
echo "  https://github.com/rammahajan009/GoogleAnalyticsPOC/releases/tag/v$VERSION"
echo ""
echo "📋 Next Steps:"
echo "  1. Go to GitHub Releases to upload the APK"
echo "  2. Add release notes and description"
echo "  3. Share the release link with others"
echo ""
echo "💡 Tip: The GitHub Actions workflow will automatically build and release"
echo "     when you push a tag. Check the Actions tab for progress." 