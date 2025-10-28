import { expect } from 'vitest';
import { CI } from '../../../src/index.js';
import type { PlatformTestConfig } from '../shared/types.js';
import type { IGithubActionCiInfo } from '../../../src/index.js';

export const githubActionsConfig: PlatformTestConfig = {
  expectedCiType: CI.GITHUB_ACTION,
  platformName: 'GitHub Actions',
  requiredFields: ['executionUrl'],

  customAssertions: (ciInfo) => {
    // Type guard to access GitHub-specific fields
    if (ciInfo.ci !== CI.GITHUB_ACTION) {
      throw new Error('Expected GitHub Actions CI type');
    }

    const ghInfo = ciInfo as IGithubActionCiInfo;

    // Assert execution URL format
    expect(ghInfo.executionUrl).toMatch(
      /^https:\/\/github\.com\/.+\/.+\/actions\/runs\/\d+$/,
    );

    console.log('  ✓ GitHub Actions execution URL is valid');

    // Assert repository context (should match current repo)
    expect(process.env.GITHUB_REPOSITORY).toBeTruthy();
    console.log(`  ✓ Running in repository: ${process.env.GITHUB_REPOSITORY}`);

    // Assert workflow context
    expect(process.env.GITHUB_WORKFLOW).toBeTruthy();
    console.log(`  ✓ Workflow: ${process.env.GITHUB_WORKFLOW}`);

    // If this is a pull request, assert PR-specific fields
    if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
      expect(ghInfo.pullRequestNumber).toBeTruthy();
      expect(typeof ghInfo.pullRequestNumber).toBe('number');
      console.log(`  ✓ Pull Request #${ghInfo.pullRequestNumber}`);
    }

    // If this is a tag push, assert tag is detected
    if (process.env.GITHUB_REF_TYPE === 'tag') {
      expect(ghInfo.tag).toBeTruthy();
      console.log(`  ✓ Tag detected: ${ghInfo.tag}`);
    }
  },
};
