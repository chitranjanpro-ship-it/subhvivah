# Subhvivah Mobile (Android & iOS)

This directory contains instructions for building the mobile version of Subhvivah using a React Native bridge to the PWA.

## Build Approach
We use `react-native-webview` to wrap the production-deployed PWA. This ensures that the mobile app always has the latest features and a consistent UI/UX across all platforms.

## Prerequisites
- Node.js
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

## Setup
1. Initialize React Native:
   ```bash
   npx react-native@latest init Subhvivah
   ```
2. Install WebView:
   ```bash
   npm install react-native-webview
   ```
3. Update `App.tsx` to point to the PWA:
   ```tsx
   import React from 'react';
   import { SafeAreaView, StatusBar } from 'react-native';
   import { WebView } from 'react-native-webview';

   const App = () => {
     return (
       <SafeAreaView style={{ flex: 1 }}>
         <StatusBar barStyle="dark-content" />
         <WebView 
           source={{ uri: 'https://subhvivah.vercel.app' }} 
           style={{ flex: 1 }}
         />
       </SafeAreaView>
     );
   };

   export default App;
   ```

## Native Features
- **Biometric Auth**: Can be added via `react-native-biometrics`.
- **Push Notifications**: Can be added via `react-native-push-notification`.
- **Camera Access**: Handled automatically by WebView for document uploads.

## PWA Features
The web app is already a PWA, meaning users can "Add to Home Screen" on both Android and iOS without needing the native app from the store.
