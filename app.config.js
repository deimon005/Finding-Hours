import 'dotenv/config';

export default {
  expo: {
    name: 'Finding Hours',
    slug: 'finding-hours',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.deimon.findinghours'
    },
    android: {
      package: 'com.deimon.findinghours',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'webpack' // ✅ Esto permite usar expo export:web
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "6478ae93-b8cf-407b-a21f-c1849ba8068c"
      }
    },
    plugins: [],
    runtimeVersion: {
      policy: "sdkVersion"
    }
  }
};
