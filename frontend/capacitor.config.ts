import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cl.jembatech.cotizador',
  appName: 'JembaTech',
  webDir: 'dist/jemba-cotiza/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
