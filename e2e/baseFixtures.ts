import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { test as baseTest } from '@playwright/test'
import v8toIstanbul from 'v8-to-istanbul'

const c8CLIOutput = path.join(process.cwd(), 'coverage/tmp');
const istanbulCLIOutput = path.join(process.cwd(), '.nyc_output');
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

    //write v8 coverage file
    let coverage = await page.coverage.stopJSCoverage();
    coverage = coverage.filter((it) => it.url.match(/(?<=\/src).*\.(js|mjs|jsx|ts|tsx)$/));
    console.log(`files: ${coverage.length}`);

    const result =  coverage.map( entry => {
      return { 
        ...entry,
        url: entry.url.replace(baseURL, process.cwd())
      }
    })
    fs.writeFileSync(path.join(c8CLIOutput, `playwright_v8_coverage_${generateUUID()}.json`), JSON.stringify({result}));

    //convert to istanbul format
    await fs.promises.mkdir(istanbulCLIOutput, { recursive: true });
    let istanbulResult = {};
    for (const entry of result) {
      const converter = v8toIstanbul(entry.url, 0, { source: entry.source });
      await converter.load();
      converter.applyCoverage(entry.functions);
      const converted = converter.toIstanbul();
      istanbulResult = {...istanbulResult, ...converted};
    }
    fs.writeFileSync(path.join(istanbulCLIOutput, `playwright_coverage_${generateUUID()}.json`),  JSON.stringify(istanbulResult));
  },
});

export const expect = test.expect;