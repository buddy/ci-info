import type { CI, CiInfo } from "../../../src/index.js";

export interface PlatformTestConfig {
  expectedCiType: CI;
  platformName: string;
  customAssertions?: (ciInfo: CiInfo) => void | Promise<void>;
  requiredFields?: string[];
}

export interface TestResults {
  ciInfo: CiInfo;
  branchName: string | undefined;
  commitHash: string | undefined;
  formattedInfo: string;
}
