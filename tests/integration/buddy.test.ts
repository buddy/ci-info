import { describe, test } from 'vitest';
import { testCiPlatform } from './shared/test-runner.js';
import { buddyConfig } from './configs/buddy.js';

describe('Buddy CI Integration', () => {
  test.skipIf(process.env.BUDDY !== 'true')(
    'should detect Buddy CI environment and extract correct information',
    async () => {
      await testCiPlatform(buddyConfig);
    },
  );
});
