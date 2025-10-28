import { describe, test } from 'vitest';
import { testCiPlatform } from './shared/test-runner.js';
import { circleCiConfig } from './configs/circleci.js';

describe('CircleCI Integration', () => {
  test.skipIf(process.env.CIRCLECI !== 'true')(
    'should detect CircleCI environment and extract correct information',
    async () => {
      await testCiPlatform(circleCiConfig);
    },
  );
});
