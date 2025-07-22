# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native mobile application for real estate investment calculations built with Expo SDK 53. The app provides 6 different calculators for various real estate investment strategies.

## Essential Commands

### Development
```bash
# Start the mobile app development server
npm start

# Run on specific platforms
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

### Testing
```bash
# Run all tests (from parent directory)
cd ../cashflow-testing && npm test
```

## Dependency Analysis

### Core Framework Dependencies

#### **react (19.0.0)** - Core React Library
- **Usage**: Used in 96+ component files throughout the app
- **Files**: All .js/.jsx files in app/UserInterface/, App.js, AppNavigator.Js
- **Purpose**: Provides React hooks (useState, useEffect, useRef), component creation, and JSX support

#### **react-native (0.79.5)** - React Native Framework
- **Usage**: Used in 94+ component files
- **Files**: All screen and component files
- **Purpose**: Native UI components (View, Text, TouchableOpacity, Modal, StyleSheet, etc.)

#### **expo (~53.0.0)** - Development Platform
- **Usage**: Project configuration and build tooling
- **Files**: app.json, metro.config.js
- **Purpose**: Development framework and build system

### AWS/Authentication Dependencies

#### **aws-amplify (^6.15.3)** - Backend Services
- **Usage**: Used in 14 files for authentication and backend integration
- **Key Files**:
  - `App.js` - Main Amplify configuration and setup
  - `app/UserInterface/Utils/AuthUtils.Js` - Authentication utilities
  - Auth screens (SignIn, SignUp, etc.) - User authentication flows
- **Purpose**: AWS authentication, user management, and backend API integration

#### **@aws-amplify/react-native (^1.1.10)** - React Native AWS Integration
- **Purpose**: React Native specific AWS services integration

#### **@aws-amplify/rtn-web-browser (^1.1.4)** - OAuth Browser Support
- **Usage**: Used in OAuth authentication flows
- **Files**: `app/UserInterface/Components/SocialSignInButton.Js`
- **Purpose**: Web browser integration for OAuth sign-in

#### **@aws-amplify/ui-react-native (^2.5.3)** - AWS UI Components
- **Purpose**: Pre-built authentication UI components

### Navigation Dependencies

#### **@react-navigation/native (^6.1.18)** - Navigation Framework
- **Usage**: Used in 53 files throughout the app
- **Files**: App.js, AppNavigator.Js, and most screen components
- **Purpose**: Navigation hooks (useNavigation), navigation prop handling

#### **@react-navigation/stack (^6.4.1)** - Stack Navigation
- **Usage**: Stack-based navigation between screens
- **Files**: `AppNavigator.Js`

### UI/UX Dependencies

#### **@expo/vector-icons (^14.0.2)** - Icon Library
- **Usage**: Used in 11 files for UI icons
- **Files**: PDFViewer.Js, NumericInputBox.Js, LoanTerm.Js
- **Purpose**: Provides Ionicons and other icon sets

#### **react-native-svg (15.11.2)** - SVG Support
- **Usage**: Used in 28 icon files
- **Files**: All files in `app/assets/icons/` (GoogleIcon.jsx, AppleIcon.jsx, etc.)
- **Purpose**: SVG rendering for custom icons and graphics
- **Configuration**: Configured in metro.config.js with react-native-svg-transformer

#### **lottie-react-native (7.2.2)** - Animation Library
- **Usage**: Used for app loading animations
- **Files**: `app/UserInterface/Components/AnimationLoader.Js`
- **Purpose**: JSON-based animations

### React Native Community Dependencies

#### **@react-native-community/slider (4.5.6)** - Slider Component
- **Usage**: Used for loan term selection
- **Files**: `app/UserInterface/Components/LoanTerm.Js`
- **Purpose**: Native slider input component

#### **@react-native-picker/picker (2.11.1)** - Picker Component
- **Usage**: Used in 8 files for dropdown selections
- **Files**: StateDropdown.Js, FeedbackScreen.Js, OperatingExpenses.Js
- **Purpose**: Native picker/dropdown selection component

#### **@react-native-community/hooks (^3.0.0)** - React Native Hooks
- **Usage**: Used in TutorialOperatingExpense.Js and other components
- **Purpose**: Additional React Native specific hooks

### Expo Modules

#### **expo-web-browser (~14.2.0)** - Web Browser Functionality
- **Usage**: OAuth browser sessions and web authentication
- **Files**: 
  - `app/UserInterface/Components/SocialSignInButton.Js`
  - `app/UserInterface/Utils/WebBrowserConfig.Js`

#### **expo-linear-gradient (~14.1.5)** - Gradient Support
- **Usage**: Linear gradient styling for UI components
- **Files**: `app/UserInterface/Components/LoanTerm.Js`

#### **Other Expo Modules**
- **expo-application, expo-asset, expo-auth-session, expo-clipboard, expo-constants, expo-device, expo-file-system, expo-font, expo-localization, expo-status-bar, expo-system-ui, expo-updates** - Configured in app.json and used indirectly by the Expo framework

### Third-party Libraries

#### **react-native-gesture-handler (~2.24.0)** - Gesture Support
- **Usage**: Advanced gesture recognition and handling
- **Files**: `app/UserInterface/Screens/HistoryScreen.Js`

#### **react-native-reanimated (~3.17.4)** - Advanced Animations
- **Purpose**: High-performance animations and transitions (required by other libraries)

#### **react-native-screens (~4.11.1)** - Native Screen Optimization
- **Purpose**: Native screen transitions and performance optimization (used by React Navigation)

#### **react-native-safe-area-context (5.4.0)** - Safe Area Handling
- **Purpose**: Safe area insets for different device types (used by React Navigation and Expo)

### Communication/Media Dependencies

#### **@emailjs/react-native (^4.2.2)** - Email Service
- **Usage**: Email sending for feedback forms
- **Files**: `app/UserInterface/Screens/FeedbackScreen.Js`

#### **react-native-pdf (^6.7.7)** - PDF Viewing
- **Usage**: PDF document viewing within the app
- **Files**: `app/UserInterface/Components/PDFViewer.Js`
- **Note**: Requires config plugin for native functionality

#### **react-native-blob-util (^0.21.2)** - File Operations
- **Purpose**: File system operations and blob handling (used by react-native-pdf)

### Data Visualization Dependencies

#### **react-native-pie-chart (^3.0.2)** - Pie Chart Component
- **Usage**: Pie chart visualization for expense breakdowns
- **Files**: `app/UserInterface/Components/ExpensePieChart.Js`

#### **react-native-heroicons (^4.0.0)** - Heroicons Library
- **Usage**: Heroicons icon set (ChevronDownIcon)
- **Files**: StateDropdown.js, FeedbackScreen.js

### Analytics Dependencies

#### **posthog-react-native (^4.1.4)** - Analytics
- **Usage**: User analytics and event tracking
- **Files**: `App.js`

### Storage Dependencies

#### **@react-native-async-storage/async-storage (2.1.2)** - Async Storage
- **Usage**: Local data persistence and storage
- **Purpose**: Cross-platform async storage solution (replaces deprecated AsyncStorage)

### UI Enhancement Dependencies

#### **@gorhom/bottom-sheet (^5.0.6)** - Bottom Sheet Component
- **Usage**: Modal bottom sheet UI components
- **Purpose**: Advanced modal presentations with gesture support

#### **react-native-markdown-display (^7.0.2)** - Markdown Rendering
- **Usage**: Markdown content rendering
- **Files**: `app/UserInterface/Components/ArticleModal.Js`
- **Purpose**: Display formatted markdown content in the app

### Development Dependencies

#### **expo-dev-client (~5.2.4)** - Development Client
- **Usage**: Custom development client for Expo projects
- **Purpose**: Enables custom native code during development

#### **Metro Build Tools** - Build System
- **metro (^0.82.0)**, **metro-config (^0.82.0)**, **metro-resolver (^0.82.0)**
- **Purpose**: Metro bundler for React Native builds
- **Configuration**: Overrides specified in package.json

### Polyfills and Utilities

#### **react-native-get-random-values (^1.11.0)** - Crypto Polyfill
- **Purpose**: Polyfill for crypto.getRandomValues() (required by AWS Amplify)

#### **react-native-url-polyfill (^2.0.0)** - URL Polyfill
- **Purpose**: URL constructor polyfill for React Native (required by AWS Amplify)

## Updated Dependencies Status

### Recently Added Dependencies
- **@react-native-async-storage/async-storage (2.1.2)** - Now actively used for local storage
- **@gorhom/bottom-sheet (^5.0.6)** - Added for advanced modal UI components
- **react-native-markdown-display (^7.0.2)** - Now actively used in ArticleModal.Js
- **expo-dev-client (~5.2.4)** - Added for custom development builds
- **Metro build tools** - Upgraded and configured for improved build performance

### Dependencies No Longer Listed as Unused
- **@react-native-community/netinfo (^11.4.1)** - Still in package.json, usage needs verification
- **react-native-markdown-display** - Now actively used for markdown rendering

## Security Vulnerabilities

Current known vulnerabilities that should be addressed:
- **@eslint/plugin-kit** (high severity)
- **markdown-it** in react-native-markdown-display (moderate severity)
- **on-headers** (compression dependency)

## Native Dependencies with Config Plugins

The following native dependencies now have config plugins properly configured:
- **react-native-pdf** - uses `@config-plugins/react-native-pdf (^11.0.0)`
- **react-native-blob-util** - uses `@config-plugins/react-native-blob-util (^11.0.0)`

Both plugins are listed in app.json plugins array and dependencies are updated to compatible versions.

## Configuration Files

### metro.config.js
- Configures `react-native-svg-transformer` for SVG support
- Uses `@react-native/metro-config` and `expo/metro-config`

### babel.config.js
- Uses `babel-preset-expo` (standard Expo configuration)

### app.json
- Configures plugins: `expo-asset`, `expo-localization`, `@config-plugins/react-native-blob-util`, `@config-plugins/react-native-pdf`, `expo-dev-client`
- Sets up deep linking and OAuth redirects for AWS Amplify
- Updated to version 1.3.1 with Expo SDK 53 support

## Architecture Notes

- **Development Build Setup**: Project has ios/ and android/ folders, indicating custom native code capability
- **AWS Integration**: Heavy reliance on AWS Amplify for authentication and backend services
- **Component Structure**: Well-organized component hierarchy in app/UserInterface/
- **Navigation**: Complex navigation structure with React Navigation stack navigation
- **Data Visualization**: Specialized charting components for financial calculations