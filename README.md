# Cashflow - Real Estate Investment Calculator

Property of Cashflow Software Ltd.

A comprehensive React Native mobile application built with Expo SDK 53 that provides real estate investors with powerful calculation tools. Designed as a "calculator in your pocket," the app features 6 specialized calculators for different investment strategies, user authentication, calculation history, and data visualization.

## Project Structure

This repository contains three main modules:

- **`cashflow/`** - Main React Native/Expo mobile application
- **`cashflow-server/`** - AWS Amplify backend infrastructure (TypeScript)
- **`cashflow-testing/`** - Jest test suite for calculation functions

## Quick Start

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Emulator

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cashflow-total/cashflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on specific platforms**
   ```bash
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   npm run web      # Web browser
   ```

### Testing

```bash
# Run all tests (from parent directory)
cd ../cashflow-testing && npm test

# Run a specific test file
cd ../cashflow-testing && npm test -- [test-file-name]
```

## Features

### Investment Calculators

1. **Rental Property Calculator** - Calculate cashflow and ROI for residential rental properties (1-4 units)
2. **Wholesale Calculator** - Determine wholesale contract selling price and profit margins
3. **BRRRR Calculator** - "Buy, Rehab, Rent, Refinance, Repeat" strategy with rehab and rental period calculations
4. **Flip Calculator** - ROI analysis for fix-and-flip properties
5. **Commercial Multifamily Calculator** - Cashflow analysis for commercial properties (5+ units)
6. **Projection Calculator** - Determine optimal purchase price based on cashflow goals

### Core Features

- **User Authentication** - AWS Amplify-powered sign-up/sign-in with email and social providers
- **Calculation History** - SQLite database storing all calculations with user attribution
- **Data Visualization** - Pie charts and visual breakdowns of expenses and returns
- **Expense Management** - Customizable operating expense tracking
- **PDF Viewing** - In-app document viewing capabilities
- **Feedback System** - EmailJS integration for user support

## Architecture

### Mobile App (React Native + Expo)
- **Framework**: Expo SDK 53 with React Native 0.79.5
- **Navigation**: React Navigation with tab-based structure
- **State Management**: React hooks with AWS Amplify DataStore
- **Authentication**: AWS Amplify Auth with social sign-in support

### Backend (AWS Amplify)
- **Language**: TypeScript
- **Services**: Authentication, user attributes, data synchronization
- **Configuration**: Email/password and OAuth providers

### Key Dependencies

#### Core Framework
- **React 19.0.0** - Core React library
- **React Native 0.79.5** - Mobile framework
- **Expo ~53.0.0** - Development platform

#### AWS Integration
- **aws-amplify ^6.15.3** - Backend services and authentication
- **@aws-amplify/react-native ^1.1.10** - React Native AWS integration
- **@aws-amplify/ui-react-native ^2.5.3** - Pre-built auth UI components

#### Navigation & UI
- **@react-navigation/native ^6.1.18** - Navigation framework
- **@react-navigation/stack ^6.4.1** - Stack navigation
- **@expo/vector-icons ^14.0.2** - Icon library
- **react-native-svg 15.11.2** - SVG support

#### Specialized Features
- **react-native-pdf ^6.7.7** - PDF viewing
- **react-native-pie-chart ^3.0.2** - Data visualization
- **@emailjs/react-native ^4.2.2** - Email functionality
- **posthog-react-native ^4.1.4** - Analytics
- **lottie-react-native 7.2.2** - Animations

## File Structure

```
app/
├── UserInterface/
│   ├── Screens/           # Main application screens
│   ├── Components/        # Reusable UI components
│   ├── Tabs/             # Tab navigation components
│   └── Utils/            # Utility functions and helpers
├── assets/
│   ├── icons/            # SVG icons
│   └── text/             # App content and copy
└── database/             # SQLite database configurations
```

### Key Files

- **App.js** - Main app entry point with AWS Amplify configuration
- **AppNavigator.Js** - Navigation structure and routing
- **cashflowDatabase.Js** - Calculation storage and retrieval
- **expenseDatabase.Js** - Operating expense management

## Development Notes

- **Code Style**: No ESLint/Prettier configuration - follow existing patterns
- **TypeScript**: Used only in backend (`cashflow-server/`)
- **Testing**: Comprehensive test suite located in `cashflow-testing/`
- **Metro Configuration**: Custom setup for SVG support via `react-native-svg-transformer`

## Backend Development

The AWS Amplify backend is located in `cashflow-server/amplify/`. No local development server is available - deployment is handled through AWS Amplify console.

## Security

- Email support integration: support@cashflow.deal
- AWS authentication with secure user attribute management

## Contributing

1. Follow existing code style and patterns
2. Ensure all calculator functions have corresponding tests in `cashflow-testing/`
3. Test authentication flows thoroughly
4. Include user attributes when saving calculations
