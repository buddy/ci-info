import fs from "node:fs/promises";
import { gitExec } from "./exec.js";
import {
  CI,
  CiInfo,
  IBuddyCiInfo,
  ICircleCiInfo,
  ICustomCiInfo,
  IGithubActionCiInfo,
} from "./types.js";
import {
  ERR_BASE_BRANCH_NOT_DEFINED,
  ERR_GETTING_BASE_COMMIT,
  ERR_GETTING_BRANCH_NAME,
  ERR_GETTING_COMMIT_HASH,
  ERR_GITHUB_EVENT_PATH_NOT_FOUND,
  ERR_HEAD_BRANCH_NOT_DEFINED,
  ERR_INVALID_BRANCH_NAME,
  ERR_INVALID_COMMIT_HASH,
  ERR_MISSING_FILE_WITH_HEAD_COMMIT,
  ERR_MISSING_HEAD_COMMIT_IN_FILE,
  ERR_READING_FILE_WITH_HEAD_COMMIT,
  TXT_CI_INFO,
} from "./texts.js";

export { CI } from "./types.js";
export type {
  CiInfo,
  IBuddyCiInfo,
  ICircleCiInfo,
  ICustomCiInfo,
  IGithubActionCiInfo,
} from "./types.js";

async function getGithubPullRequestCommit(
  logger?: (message: string) => unknown,
) {
  const payloadPath = process.env.GITHUB_EVENT_PATH;
  if (!payloadPath) {
    logger?.(ERR_GITHUB_EVENT_PATH_NOT_FOUND);
    return process.env.GITHUB_SHA;
  }
  try {
    await fs.access(payloadPath);
  } catch (error) {
    logger?.(
      ERR_MISSING_FILE_WITH_HEAD_COMMIT(payloadPath, JSON.stringify(error)),
    );
    return process.env.GITHUB_SHA;
  }

  let payload;
  try {
    const payloadFile = await fs.readFile(payloadPath);
    payload = JSON.parse(payloadFile.toString());
  } catch (error) {
    logger?.(
      ERR_READING_FILE_WITH_HEAD_COMMIT(payloadPath, JSON.stringify(error)),
    );
    return process.env.GITHUB_SHA;
  }

  if (!payload?.pull_request) {
    logger?.(ERR_MISSING_HEAD_COMMIT_IN_FILE);
    return process.env.GITHUB_SHA;
  }

  return payload.pull_request.head.sha;
}

export async function getBranchName({
  optional,
  logger,
}: {
  optional?: boolean;
  logger?: (message: string) => unknown;
} = {}) {
  let branch = "";
  try {
    branch = await gitExec(["rev-parse", "--abbrev-ref", "HEAD"]);
  } catch (error) {
    if (!optional) {
      logger?.(ERR_GETTING_BRANCH_NAME(JSON.stringify(error)));
    }
  }
  branch = branch.trim();
  if (!branch) {
    if (!optional) {
      logger?.(ERR_INVALID_BRANCH_NAME);
    }
    return;
  }

  return branch?.trim();
}

export async function getCommitHash({
  optional,
  logger,
}: {
  optional?: boolean;
  logger?: (message: string) => unknown;
}) {
  let commit = "";
  try {
    commit = await gitExec(["rev-parse", "--verify", "HEAD"]);
  } catch (error) {
    if (!optional) {
      logger?.(ERR_GETTING_COMMIT_HASH(JSON.stringify(error)));
    }
  }
  commit = commit.trim();
  if (!commit || commit.length !== 40) {
    if (!optional) {
      logger?.(ERR_INVALID_COMMIT_HASH(commit));
    }
    return;
  }

  return commit;
}

async function getBaseCommit(
  baseBranch: string | undefined,
  headBranch?: string,
  requiredOriginPrefix?: boolean,
  logger?: (message: string) => unknown,
) {
  if (!baseBranch) {
    logger?.(ERR_BASE_BRANCH_NOT_DEFINED);
    return;
  }
  if (!headBranch) {
    logger?.(ERR_HEAD_BRANCH_NOT_DEFINED);
    return;
  }

  let commit = "";
  try {
    const preparedBranch =
      requiredOriginPrefix && !headBranch.includes("origin/")
        ? `origin/${headBranch}`
        : headBranch;
    const preparedBaseBranch =
      requiredOriginPrefix && !baseBranch.includes("origin/")
        ? `origin/${baseBranch}`
        : baseBranch;

    commit = await gitExec(["merge-base", preparedBranch, preparedBaseBranch]);
  } catch (error) {
    logger?.(
      ERR_GETTING_BASE_COMMIT(baseBranch, headBranch, JSON.stringify(error)),
    );
  }
  commit = commit.trim();
  if (!commit || commit.length !== 40) {
    logger?.(ERR_INVALID_COMMIT_HASH(commit));
    return;
  }

  return commit;
}

async function getCommitDetails(commitHash?: string) {
  if (commitHash) {
    const commitDetails = await gitExec([
      "show",
      "--no-patch",
      "--pretty=%an%n%ae%n%ct%n%B",
      commitHash,
    ]);
    const [authorName, authorEmail, authorDate, message] =
      commitDetails.split("\n");
    const authorDateNumber = Number(authorDate);
    return {
      authorName,
      authorEmail,
      authorDate: Number.isNaN(authorDateNumber) ? undefined : authorDateNumber,
      message,
    };
  }
}

export async function getCiAndGitInfo({
  baseBranch,
  skipBaseCommitDiscovery,
  logger,
}: {
  baseBranch?: string;
  skipBaseCommitDiscovery?: boolean;
  logger?: (message: string) => unknown;
} = {}): Promise<CiInfo> {
  const isBuddy = process.env.BUDDY === "true";
  const isGithubAction = process.env.GITHUB_ACTIONS === "true";
  const isCircleCI = process.env.CIRCLECI === "true";

  const forcedTag = process.env.FORCED_ENV_TAG;
  const forcedBranch = process.env.FORCED_ENV_BRANCH;
  const forcedCommit = process.env.FORCED_ENV_COMMIT;
  const forcedBaseCommit = process.env.FORCED_ENV_BASE_COMMIT;

  const withoutBaseCommit = baseBranch === undefined || skipBaseCommitDiscovery;

  if (isBuddy) {
    const pullRequestNumber = Number(process.env.BUDDY_RUN_PR_NO);
    const isPR = !!pullRequestNumber;
    const branch =
      forcedBranch ||
      (isPR
        ? process.env.BUDDY_RUN_PR_HEAD_BRANCH
        : process.env.BUDDY_EXECUTION_BRANCH);
    const tag = forcedTag || process.env.BUDDY_EXECUTION_TAG;
    const commit = forcedCommit || process.env.BUDDY_EXECUTION_REVISION;
    const baseCommit = withoutBaseCommit
      ? undefined
      : forcedBaseCommit ||
        (isPR ? await getBaseCommit(baseBranch, branch, true) : undefined);
    const invokerId = Number(process.env.BUDDY_TRIGGERING_ACTOR_ID);
    const pipelineId = Number(process.env.BUDDY_PIPELINE_ID);
    const actionId = Number(process.env.BUDDY_ACTION_ID);

    const executionId = process.env.BUDDY_RUN_HASH;
    const actionExecutionId = process.env.BUDDY_ACTION_RUN_HASH;

    return {
      ci: CI.BUDDY,
      branch,
      tag,
      pullRequestNumber: isPR ? pullRequestNumber : undefined,
      commit,
      baseCommit,
      pipelineName: process.env.BUDDY_PIPELINE_NAME,
      pipelineId: Number.isNaN(pipelineId) ? undefined : pipelineId,
      actionId: Number.isNaN(actionId) ? undefined : actionId,
      executionId,
      actionExecutionId,
      invokerId: Number.isNaN(invokerId) ? undefined : invokerId,
      commitDetails: await getCommitDetails(commit),
    } satisfies IBuddyCiInfo;
  }

  if (isGithubAction) {
    const isPR = process.env.GITHUB_EVENT_NAME === "pull_request";
    const isTag = process.env.GITHUB_REF_TYPE === "tag";
    const pullRequestNumber =
      isPR && process.env.GITHUB_REF
        ? Number(process.env.GITHUB_REF.split("/")[2])
        : undefined;
    const branch =
      forcedBranch ||
      (isPR ? process.env.GITHUB_HEAD_REF : process.env.GITHUB_REF_NAME);
    const tag = forcedTag || (isTag ? process.env.GITHUB_REF_NAME : undefined);
    const commit =
      forcedCommit ||
      (isPR
        ? await getGithubPullRequestCommit(logger)
        : process.env.GITHUB_SHA);
    const baseCommit = withoutBaseCommit
      ? undefined
      : forcedBaseCommit ||
        (isPR ? await getBaseCommit(baseBranch, branch, true) : undefined);
    return {
      ci: CI.GITHUB_ACTION,
      branch,
      tag,
      pullRequestNumber,
      commit,
      baseCommit,
      commitDetails: await getCommitDetails(commit),
      executionUrl: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
    } satisfies IGithubActionCiInfo;
  }

  if (isCircleCI) {
    const isPR = process.env.CIRCLE_PULL_REQUEST;
    const pullRequestNumber = isPR
      ? Number(process.env.CIRCLE_PR_NUMBER)
      : undefined;
    const branch = forcedBranch || process.env.CIRCLE_BRANCH;
    const tag = forcedTag || process.env.CIRCLE_TAG;
    const commit = forcedCommit || process.env.CIRCLE_SHA1;
    const baseCommit = withoutBaseCommit
      ? undefined
      : forcedBaseCommit ||
        (isPR ? await getBaseCommit(baseBranch, branch) : undefined);
    return {
      ci: CI.CIRCLE_CI,
      branch,
      tag,
      pullRequestNumber,
      commit,
      baseCommit,
      commitDetails: await getCommitDetails(commit),
      executionUrl: `${process.env.CIRCLE_BUILD_URL}`,
    } satisfies ICircleCiInfo;
  }

  const branch =
    forcedBranch ||
    (await getBranchName({ optional: withoutBaseCommit, logger }));
  const commit =
    forcedCommit ||
    (await getCommitHash({ optional: withoutBaseCommit, logger }));

  return {
    ci: CI.NONE,
    branch,
    commit,
    baseCommit: withoutBaseCommit
      ? undefined
      : branch && branch !== baseBranch
        ? forcedBaseCommit || (await getBaseCommit(baseBranch, branch))
        : undefined,
    commitDetails: await getCommitDetails(commit),
  } satisfies ICustomCiInfo;
}

export function formattedCiInfo(ciInfo: CiInfo) {
  return TXT_CI_INFO(ciInfo);
}
