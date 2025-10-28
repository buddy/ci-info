import { expect } from 'vitest';
import { CI } from '../../../src/index.js';
import type { PlatformTestConfig } from '../shared/types.js';
import type { ICircleCiInfo } from '../../../src/index.js';

export const circleCiConfig: PlatformTestConfig = {
  expectedCiType: CI.CIRCLE_CI,
  platformName: 'CircleCI',
  requiredFields: ['executionUrl'],

  customAssertions: (ciInfo) => {
    // Type guard to access CircleCI-specific fields
    if (ciInfo.ci !== CI.CIRCLE_CI) {
      throw new Error('Expected CircleCI CI type');
    }

    const circleInfo = ciInfo as ICircleCiInfo;

    // Assert execution URL (build URL)
    expect(circleInfo.executionUrl).toBeTruthy();
    expect(circleInfo.executionUrl).toMatch(/^https:\/\/(app\.)?circleci\.com\//);
    console.log(`  ✓ Build URL: ${circleInfo.executionUrl}`);

    // Assert CircleCI environment variable
    expect(process.env.CIRCLECI).toBe('true');
    console.log('  ✓ Running in CircleCI environment');

    // If this is a pull request, assert PR-specific fields
    if (circleInfo.pullRequestNumber) {
      expect(typeof circleInfo.pullRequestNumber).toBe('number');
      console.log(`  ✓ Pull Request #${circleInfo.pullRequestNumber}`);
    }

    // If this is a tag build, assert tag is detected
    if (circleInfo.tag) {
      expect(circleInfo.tag).toBeTruthy();
      console.log(`  ✓ Tag detected: ${circleInfo.tag}`);
    }

    // Assert project and workflow context
    if (process.env.CIRCLE_PROJECT_REPONAME) {
      console.log(`  ✓ Repository: ${process.env.CIRCLE_PROJECT_REPONAME}`);
    }
    if (process.env.CIRCLE_WORKFLOW_ID) {
      console.log(`  ✓ Workflow ID: ${process.env.CIRCLE_WORKFLOW_ID}`);
    }
    if (process.env.CIRCLE_JOB) {
      console.log(`  ✓ Job: ${process.env.CIRCLE_JOB}`);
    }
  },
};
