# 🚀 Automated Release System

## 📦 **Quick Release Commands**

### **Automatic Release (Recommended)**
```bash
# Release with current date as version
yarn release

# Release with custom version
yarn release 1.0.1
```

### **Manual Release Steps**
```bash
# 1. Build APK
cd android && ./gradlew assembleDebug

# 2. Create tag
git tag -a v1.0.1 -m "Release v1.0.1"

# 3. Push to GitHub
git push origin main
git push origin v1.0.1
```

## 🔄 **GitHub Actions Workflow**

The `.github/workflows/release.yml` file automatically:
- ✅ Builds the APK when you push a tag
- ✅ Creates a GitHub release
- ✅ Uploads the APK to the release
- ✅ Generates release notes

### **Trigger the Workflow**
```bash
# Create and push a tag
git tag -a v1.0.2 -m "Release v1.0.2"
git push origin v1.0.2
```

## 📱 **Release Process**

### **1. Automated Release (One Command)**
```bash
yarn release
```
This will:
- Clean previous builds
- Install dependencies
- Build Android APK
- Create git tag
- Push to GitHub
- Trigger GitHub Actions

### **2. GitHub Actions Build**
When you push a tag, GitHub Actions will:
- Build the APK in the cloud
- Create a release
- Upload the APK
- Generate release notes

### **3. Manual Upload (Alternative)**
If you prefer manual control:
1. Run `yarn release` to build locally
2. Go to GitHub Releases
3. Upload the APK manually
4. Add release notes

## 🎯 **Release URLs**

After a release, your URLs will be:
- **Release Page**: `https://github.com/rammahajan009/GoogleAnalyticsPOC/releases/tag/v{VERSION}`
- **Direct Download**: `https://github.com/rammahajan009/GoogleAnalyticsPOC/releases/download/v{VERSION}/app-debug.apk`

## 📋 **Release Checklist**

### **Before Release**
- [ ] Test the app locally
- [ ] Update version numbers if needed
- [ ] Commit all changes
- [ ] Check that all features work

### **During Release**
- [ ] Run `yarn release` or `yarn release 1.0.1`
- [ ] Wait for GitHub Actions to complete
- [ ] Check the release on GitHub

### **After Release**
- [ ] Test the downloaded APK
- [ ] Share the release link
- [ ] Update documentation if needed

## 🔧 **Customization**

### **Change Version Format**
Edit `scripts/release.sh`:
```bash
# Default version format
VERSION=${1:-$(date +%Y%m%d)}

# Custom format examples
VERSION=${1:-$(date +%Y.%m.%d)}
VERSION=${1:-$(date +%Y%m%d-%H%M)}
```

### **Add Release Notes**
The script automatically generates basic release notes. You can:
1. Edit the release on GitHub
2. Add detailed release notes
3. Include changelog information

## 🚨 **Troubleshooting**

### **Build Fails**
```bash
# Clean and rebuild
cd android && ./gradlew clean
cd .. && yarn release
```

### **Git Issues**
```bash
# Check git status
git status

# Commit changes first
git add .
git commit -m "Prepare for release"
yarn release
```

### **GitHub Actions Fails**
1. Check the Actions tab on GitHub
2. Look for error messages
3. Fix the issue and push again

## 📊 **Release Information**

### **APK Details**
- **Size**: ~99MB (debug build)
- **Architecture**: Universal (ARM64 + ARMv7)
- **Features**: Multi-project GA4 analytics demo
- **Dependencies**: React Native, AsyncStorage, SafeAreaContext

### **Release Features**
- Multi-project analytics switching
- Demo event testing
- SafeAreaView implementation
- TypeScript support
- Real-time console logging

## 🎉 **Success!**

Your automated release system is ready! Just run:
```bash
yarn release
```

And your APK will be automatically built, tagged, and released on GitHub! 🚀 