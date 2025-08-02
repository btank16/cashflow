import amplifyOutputs from './amplify_outputs.json';
import secretKeys from './secretkeys.json';

// Extract the domain from the OAuth configuration
const cognitoDomain = amplifyOutputs.auth.oauth.domain;

export default {
  expo: {
    name: "Cashflow",
    slug: "cashflow",
    version: "1.4.0",
    orientation: "portrait",
    icon: "./app/assets//images/CashflowAppIcon.png",
    userInterfaceStyle: "light",
    scheme: "cashflow",
    platforms: ["ios", "android", "web"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.btanski.cashflow",
      associatedDomains: [
        `applinks:${cognitoDomain}`
      ],
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      },
      config: {
        googleMapsApiKey: secretKeys.googlemaps.apikey
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./app/assets/images/CashflowAppIcon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.btanski.cashflow",
      versionCode: 4,
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: cognitoDomain,
              pathPrefix: "/oauth2/idpresponse"
            }
          ],
          category: ["BROWSABLE", "DEFAULT"]
        }
      ],
      ndkVersion: "26.1.10909125",
      config: {
        googleMaps: {
          apiKey: secretKeys.googlemaps.apikey
        }
      }
    },
    androidStatusBar: {
      barStyle: "light-content",
      backgroundColor: "#0E2C28"
    },
    web: {
      favicon: "./app/assets/images/CashflowAppIcon.png"
    },
    extra: {
      eas: {
        projectId: "13cedaf9-9498-4cab-ad7a-81166055290b"
      }
    },
    plugins: [
      "expo-asset",
      "expo-localization",
      "@config-plugins/react-native-blob-util",
      "@config-plugins/react-native-pdf",
      "expo-dev-client",
      [
        "expo-maps",
        {
          requestLocationPermission: true,
          locationPermission: "Allow Cashflow to use your location"
        }
      ]
    ],
    runtimeVersion: "1.4.0",
    updates: {
      url: "https://u.expo.dev/13cedaf9-9498-4cab-ad7a-81166055290b"
    }
  }
};