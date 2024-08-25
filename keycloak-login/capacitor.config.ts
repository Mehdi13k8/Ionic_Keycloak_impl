import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.keycloaklogin.app',
  appName: 'keycloak-login',
  webDir: 'www',
  server: {
    hostname: 'com.keycloaklogin.app.local',
    androidScheme: 'http',
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
