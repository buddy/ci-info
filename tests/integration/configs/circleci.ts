import { expect } from "vitest";
import { CI } from "../../../src/index.js";
import type { PlatformTestConfig } from "../shared/types.js";

export const circleCiConfig: PlatformTestConfig = {
  expectedCiType: CI.CIRCLE_CI,
  platformName: "CircleCI",
  requiredFields: ["executionUrl"],

  customAssertions: (ciInfo) => {
    if (ciInfo.ci !== CI.CIRCLE_CI) {
      throw new Error("Expected CircleCI CI type");
    }

    expect(ciInfo.executionUrl).toBeTruthy();
    expect(ciInfo.executionUrl).toMatch(/^https:\/\/(app\.)?circleci\.com\//);

    if (ciInfo.pullRequestNumber) {
      expect(typeof ciInfo.pullRequestNumber).toBe("number");
    }

    if (ciInfo.tag) {
      expect(ciInfo.tag).toBeTruthy();
    }
  },
};
