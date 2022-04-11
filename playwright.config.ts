import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    baseURL: 'http://localhost:3000'
  },
  fullyParallel: true,
  webServer: {
    command: 'npm run start',
    port: 3000,
  },
  projects: [
    {
      name: 'Chrome',
      use: {
        browserName: 'chromium',
      },
    },
  ],
};

export default config;
