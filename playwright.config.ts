import { PlaywrightTestConfig } from '@playwright/test';
import path from 'path'

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'npm run start',
    port: 3000,
    env: {
      USE_BABEL_PLUGIN_ISTANBUL: '1',
    },
  },
  projects: [
    {
      name: 'Chrome',
      use: {
        browserName: 'chromium',
      },
    },
  ],
  reporter: [
    ['list'],
    [
      '@bgotink/playwright-coverage',
      /** @type {import('@bgotink/playwright-coverage').CoverageReporterOptions} */ {
        // Path to the root files should be resolved from, most likely your repository root
        sourceRoot: __dirname,
        // Files to ignore in coverage, useful
        // - if you're testing the demo app of a component library and want to exclude the demo sources
        // - or part of the code is generated
        // - or if you're running into any of the other many reasons people have for excluding files
        exclude: [],
        // Directory in which to write coverage reports
        resultDir: path.join(__dirname, 'coverage'),
        // Configure the reports to generate.
        // The value is an array of istanbul reports, with optional configuration attached.
        reports: [
          // Create an HTML view at <resultDir>/index.html
          ['html'],
          ['json'],
          // Create <resultDir>/coverage.lcov for consumption by tooling
          [
            'lcovonly',
            {
              file: 'coverage.lcov',
            },
          ],
          // Log a coverage summary at the end of the test run
          [
            'text-summary',
            {
              file: null,
            },
          ],
        ],
        // Configure watermarks, see https://github.com/istanbuljs/nyc#high-and-low-watermarks
        // watermarks: {},
      },
    ],
  ],
};

export default config;
