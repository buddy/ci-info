import type { CI, CiInfo } from '../../../src/index.js';

/**
 * Configuration for testing a specific CI platform
 */
export interface PlatformTestConfig {
  /** Expected CI type that should be detected */
  expectedCiType: CI;

  /** Platform name for display purposes */
  platformName: string;

  /**
   * Custom assertions to run for this platform
   * @param ciInfo - The detected CI info from getCiAndGitInfo()
   */
  customAssertions?: (ciInfo: CiInfo) => void | Promise<void>;

  /**
   * Fields that must be present in the CI info
   */
  requiredFields?: string[];
}

/**
 * Results from running all test functions
 */
export interface TestResults {
  ciInfo: CiInfo;
  branchName: string | undefined;
  commitHash: string | undefined;
  formattedInfo: string;
}
