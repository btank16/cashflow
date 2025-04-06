# Cashflow App

Property of Cashflow Software ltd.

This is a Mobile App developed in react native, which will function on both iOS and Android devices. Specifically, the interface is designed for smart phones. This is meant to be a "calculator in your pocket" for real estate investors. This app contains 6 different calculators, which are each used for a different type of real estate investment. All calculators except the Commercial Multifamily Calculator pertain to residential real estate (i.e., 1-4 units). The Commercial Multifamily Calculator is used for 5+ unit properties.

## Features

### Calculators

- Rental Property Calculator: This calculator is used to find cashflow on a residential rental property.
- Wholesale Calculator: This calculator is used to determine how much to sell a wholesale contract for, and in turn, how much profit you will make.
- BRRRR Calculator: This calculator pertains to the "buy, rehab, rent, refinance and repeat" strategy. This will allow you to calculate the operating expenses during both your rehab period and once the property is rented. This will also calculate the equity you will have in the property after the refinance.
- Flip Calculator: This calculator allows you to calculate the ROI on a fix and flip property.
- Commercial Multifamily Calculator: This calculator is used to find cashflow on a commercial property.
- Projection Calculator: This calculator gives you the ammount to pay for a property based on your cashflow goals. It also gives the price you will break even at, so you may choose a purchase price in the range of your profit goal to breaking even.

### Database

- Calculation Database: This is a SQLite database that stores the calculations for each calculator. The most recent calculations will show up on the Home Screen, but there is also a History Screen to view all previous calculations.
- Expense Database: This is a SQLite database that stores the expenses for each calculator. This is used to calculate the operating expenses for each calculator.

## Dependencies

### AWS Amplify

- Impacted files: SignIn.Js, SignUpThird.Js, VerificationScreen.Js, UserScreen.Js, AppNavigator.Js, App.Js
- Files with User Attributes: CalcHomeScreen, AttributeScreen, UserScreen, and SignUpThird
