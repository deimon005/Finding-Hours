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
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "your-eas-project-id" // Opcional: Si usas EAS Build
      }
    },
    plugins: [
      // Plugins adicionales si los necesitas
    ],
    runtimeVersion: {
      policy: "sdkVersion" // o "nativeVersion" si haces builds nativos
    }
  }
};