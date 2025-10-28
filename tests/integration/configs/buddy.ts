import { expect } from "vitest";
import { CI } from "../../../src/index.js";
import type { PlatformTestConfig } from "../shared/types.js";

export const buddyConfig: PlatformTestConfig = {
  expectedCiType: CI.BUDDY,
  platformName: "Buddy CI",
  requiredFields: ["pipelineName", "pipelineId", "actionId", "executionId"],

  customAssertions: (ciInfo) => {
    if (ciInfo.ci !== CI.BUDDY) {
      throw new Error("Expected Buddy CI type");
    }

    expect(ciInfo.pipelineName).toBeTruthy();
    expect(ciInfo.pipelineId).toBeTypeOf("number");
    expect(ciInfo.actionId).toBeTypeOf("number");
    expect(ciInfo.executionId).toBeTruthy();

    if (ciInfo.invokerId) {
      expect(ciInfo.invokerId).toBeTypeOf("number");
    }

    if (ciInfo.pullRequestNumber) {
      expect(typeof ciInfo.pullRequestNumber).toBe("number");
    }

    if (ciInfo.tag) {
      expect(ciInfo.tag).toBeTruthy();
    }
  },
};
