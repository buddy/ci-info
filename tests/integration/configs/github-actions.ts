import { expect } from "vitest";
import { CI } from "../../../src/index.js";
import type { PlatformTestConfig } from "../shared/types.js";

export const githubActionsConfig: PlatformTestConfig = {
  expectedCiType: CI.GITHUB_ACTION,
  platformName: "GitHub Actions",
  requiredFields: ["executionUrl"],

  customAssertions: (ciInfo) => {
    if (ciInfo.ci !== CI.GITHUB_ACTION) {
      throw new Error("Expected GitHub Actions CI type");
    }

    expect(ciInfo.executionUrl).toMatch(
      /^https:\/\/github\.com\/.+\/.+\/actions\/runs\/\d+$/,
    );

    if (process.env.GITHUB_EVENT_NAME === "pull_request") {
      expect(ciInfo.pullRequestNumber).toBeTruthy();
      expect(typeof ciInfo.pullRequestNumber).toBe("number");
    }

    if (process.env.GITHUB_REF_TYPE === "tag") {
      expect(ciInfo.tag).toBeTruthy();
    }
  },
};
