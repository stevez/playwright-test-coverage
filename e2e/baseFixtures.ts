import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { test as baseTest } from '@playwright/test'

const c8CLIOutput = path.join(process.cwd(), 'coverage/tmp');
export function generateUUID(): string {
  return crypto.randomBytes(16).toString('hex');
}

export const test = baseTest.extend({
  page: async ({page, baseURL}, use) => {

    await fs.promises.mkdir(c8CLIOutput, { recursive: true });

    await page.coverage.startJSCoverage({
      resetOnNavigation: false,
    });

    await use(page);

    const coverage = await page.coverage.stopJSCoverage();
    const result =  coverage.map( entry => {
      return { 
        ...entry,
        url: entry.url.replace(baseURL, process.cwd())
      }
    })
    

    fs.writeFileSync(path.join(c8CLIOutput, `playwright_v8_coverage_${generateUUID()}.json`), JSON.stringify({result}));

  },
});

export const expect = test.expect;