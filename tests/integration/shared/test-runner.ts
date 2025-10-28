import {
  getCiAndGitInfo,
  getBranchName,
  getCommitHash,
  formattedCiInfo,
} from '../../../src/index.js';
import type { TestResults, PlatformTestConfig } from './types.js';
import {
  assertCiType,
  assertValidBranchName,
  assertValidCommitHash,
  assertValidCommitDetails,
  assertFormattedOutput,
  assertRequiredFields,
} from './matchers.js';

/**
 * Run all exported functions and collect results
 */
export async function runAllFunctions(): Promise<TestResults> {
  const ciInfo = await getCiAndGitInfo({});
  const branchName = await getBranchName({});
  const commitHash = await getCommitHash({});
  const formattedInfo = formattedCiInfo(ciInfo);

  return {
    ciInfo,
    branchName,
    commitHash,
    formattedInfo,
  };
}

/**
 * Print detected CI information to console for debugging
 */
export function printCiInfo(results: TestResults): void {
  console.log('\n' + '='.repeat(60));
  console.log('DETECTED CI INFORMATION');
  console.log('='.repeat(60));
  console.log('\n📋 Formatted Output:\n');
  console.log(results.formattedInfo);
  console.log('\n📦 Raw CI Info Object:\n');
  console.log(JSON.stringify(results.ciInfo, undefined, 2));
  console.log('\n🌿 Branch Name:', results.branchName);
  console.log('🔖 Commit Hash:', results.commitHash);
  console.log('\n' + '='.repeat(60) + '\n');
}

/**
 * Run common assertions for all CI platforms
 */
export function assertCommonFields(results: TestResults, config: PlatformTestConfig): void {
  // Assert CI type
  assertCiType(results.ciInfo, config.expectedCiType);

  // Assert branch name is valid
  if (results.branchName) {
    assertValidBranchName(results.branchName);
  }
  if (results.ciInfo.branch) {
    assertValidBranchName(results.ciInfo.branch);
  }

  // Assert commit hash is valid
  if (results.commitHash) {
    assertValidCommitHash(results.commitHash);
  }
  if (results.ciInfo.commit) {
    assertValidCommitHash(results.ciInfo.commit);
  }

  // Assert base commit exists
  if (results.ciInfo.baseCommit) {
    assertValidCommitHash(results.ciInfo.baseCommit);
  }

  // Assert commit details if available
  assertValidCommitDetails(results.ciInfo);

  // Assert formatted output contains key information
  assertFormattedOutput(results.formattedInfo, results.ciInfo);

  // Assert required platform-specific fields
  if (config.requiredFields) {
    assertRequiredFields(results.ciInfo, config.requiredFields);
  }
}

/**
 * Main test runner for a CI platform
 */
export async function testCiPlatform(config: PlatformTestConfig): Promise<void> {
  console.log(`\n🚀 Testing ${config.platformName} detection...\n`);

  // Run all functions
  const results = await runAllFunctions();

  // Print detected information
  printCiInfo(results);

  // Run common assertions
  assertCommonFields(results, config);

  // Run platform-specific assertions
  if (config.customAssertions) {
    await config.customAssertions(results.ciInfo);
  }

  console.log(`✅ ${config.platformName} tests passed!\n`);
}
