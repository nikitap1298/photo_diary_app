import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.npphotodiary.photodiary',
  appName: 'photo-diary',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
