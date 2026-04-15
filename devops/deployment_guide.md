# Smart Launcher OS - Release Preparation Guide

## 1. Store Pre-requisites
- **Package Name**: `com.launcher`
- **Minimum SDK**: 21 (Android 5.0)
- **Target SDK**: 33+ (Android 13)

## 2. Signing the App
Before building for release, you must sign the APK/AAB.
1. Generate a keystore:
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Setup `gradle.properties`:
   ```properties
   MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=my-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=*****
   MYAPP_RELEASE_KEY_PASSWORD=*****
   ```

## 3. Play Store Compliance Checklist
- [ ] **Permissions**: Declared `android.permission.QUERY_ALL_PACKAGES` in Manifest.
- [ ] **Data Safety**: Launcher does not collect personal data without disclosure.
- [ ] **Default Intent**: User must explicitly select "Smart Launcher OS" as the Home app.
- [ ] **Monetization**: In-app purchases use Google Play Billing system.

## 4. Metadata
- **Short Description**: Fast, Desktop-style Smart Launcher for Android.
- **Full Description**: Transform your Android device into a powerful desktop-like experience with Taskbars, Start Menus, and Windowed apps. Clean, minimal, and highly customizable.

## 5. Build Commands
```bash
# Production Bundle
cd react_native_ui && npm run build:android

# Generate AAB (Upload to Play Store)
cd android_native_core && ./gradlew bundleRelease

# Generate APK (Direct Install)
cd android_native_core && ./gradlew assembleRelease
```
