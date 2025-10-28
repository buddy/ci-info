import {
  getCiAndGitInfo,
  getBranchName,
  getCommitHash,
  formattedCiInfo,
} from "../../../src/index.js";
import type { TestResults, PlatformTestConfig } from "./types.js";
import {
  assertCiType,
  assertValidBranchName,
  assertValidCommitHash,
  assertValidCommitDetails,
  assertFormattedOutput,
  assertRequiredFields,
} from "./matchers.js";

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

export function printCiInfo(results: TestResults): void {
  console.dir(results, { depth: Infinity });
}

export function assertCommonFields(
  results: TestResults,
  config: PlatformTestConfig,
): void {
  assertCiType(results.ciInfo, config.expectedCiType);
  assertValidCommitDetails(results.ciInfo);
  assertFormattedOutput(results.formattedInfo, results.ciInfo);

  if (results.branchName) {
    assertValidBranchName(results.branchName);
  }

  if (results.ciInfo.branch) {
    assertValidBranchName(results.ciInfo.branch);
  }

  if (results.commitHash) {
    assertValidCommitHash(results.commitHash);
  }

  if (results.ciInfo.commit) {
    assertValidCommitHash(results.ciInfo.commit);
  }

  if (results.ciInfo.baseCommit) {
    assertValidCommitHash(results.ciInfo.baseCommit);
  }

  if (config.requiredFields) {
    assertRequiredFields(results.ciInfo, config.requiredFields);
  }
}

export async function testCiPlatform(
  config: PlatformTestConfig,
): Promise<void> {
  const results = await runAllFunctions();

  printCiInfo(results);
  assertCommonFields(results, config);

  if (config.customAssertions) {
    await config.customAssertions(results.ciInfo);
  }
}
