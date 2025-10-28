import { describe, test } from "vitest";
import { testCiPlatform } from "./shared/test-runner.js";
import { githubActionsConfig } from "./configs/github-actions.js";

describe("GitHub Actions Integration", () => {
  test.skipIf(process.env.GITHUB_ACTIONS !== "true")(
    "should detect GitHub Actions environment and extract correct information",
    async () => {
      await testCiPlatform(githubActionsConfig);
    },
  );
});
