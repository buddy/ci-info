import { expect } from "vitest";
import { CI } from "../../../src/index.js";
import type { PlatformTestConfig } from "../shared/types.js";
import type { IBuddyCiInfo } from "../../../src/index.js";

export const buddyConfig: PlatformTestConfig = {
  expectedCiType: CI.BUDDY,
  platformName: "Buddy CI",
  requiredFields: ["pipelineName", "pipelineId", "actionId", "executionId"],

  customAssertions: (ciInfo) => {
    // Type guard to access Buddy-specific fields
    if (ciInfo.ci !== CI.BUDDY) {
      throw new Error("Expected Buddy CI type");
    }

    const buddyInfo = ciInfo as IBuddyCiInfo;

    // Assert pipeline information
    expect(buddyInfo.pipelineName).toBeTruthy();
    expect(buddyInfo.pipelineId).toBeTypeOf("number");
    console.log(
      `  ✓ Pipeline: ${buddyInfo.pipelineName} (ID: ${buddyInfo.pipelineId})`,
    );

    // Assert action information
    expect(buddyInfo.actionId).toBeTypeOf("number");
    console.log(`  ✓ Action ID: ${buddyInfo.actionId}`);

    // Assert execution IDs
    expect(buddyInfo.executionId).toBeTruthy();
    console.log(`  ✓ Execution ID: ${buddyInfo.executionId}`);

    // Assert invoker ID if present
    if (buddyInfo.invokerId) {
      expect(buddyInfo.invokerId).toBeTypeOf("number");
      console.log(`  ✓ Invoked by user ID: ${buddyInfo.invokerId}`);
    }

    // Assert Buddy environment variables exist
    expect(process.env.BUDDY).toBe("true");
    console.log("  ✓ Running in Buddy CI environment");

    // If this is a pull request, assert PR-specific fields
    if (buddyInfo.pullRequestNumber) {
      expect(typeof buddyInfo.pullRequestNumber).toBe("number");
      console.log(`  ✓ Pull Request #${buddyInfo.pullRequestNumber}`);
    }

    // If this is a tag, assert tag is detected
    if (buddyInfo.tag) {
      expect(buddyInfo.tag).toBeTruthy();
      console.log(`  ✓ Tag detected: ${buddyInfo.tag}`);
    }
  },
};
