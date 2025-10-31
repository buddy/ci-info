import { CiInfo, CI } from "./types.js";

export const ERR_GITHUB_EVENT_PATH_NOT_FOUND = `GITHUB_EVENT_PATH is not defined`;
export const ERR_MISSING_FILE_WITH_HEAD_COMMIT = (
  payloadPath: string,
  error: string,
) => `File ${payloadPath} with correct head commit does not exist: ${error}`;
export const ERR_READING_FILE_WITH_HEAD_COMMIT = (
  payloadPath: string,
  error: string,
) => `Error while reading ${payloadPath} file: ${error}`;
export const ERR_MISSING_HEAD_COMMIT_IN_FILE = `Payload does not contain pull_request`;
export const ERR_GETTING_BRANCH_NAME = (error: string) =>
  `Error while getting branch name: ${error}`;
export const ERR_INVALID_BRANCH_NAME = `Invalid branch name`;
export const ERR_GETTING_COMMIT_HASH = (error: string) =>
  `Error while getting commit hash: ${error}`;
export const ERR_INVALID_COMMIT_HASH = (commit: string) =>
  `Invalid commit hash: ${commit}`;
export const ERR_BASE_BRANCH_NOT_DEFINED = `Base branch is not defined`;
export const ERR_COMMIT_DETAILS_NOT_AVAILABLE = (error: string) =>
  `Could not get commit details: ${error}`;
export const ERR_HEAD_BRANCH_NOT_DEFINED = `Head branch is not defined`;
export const ERR_GETTING_BASE_COMMIT = (
  baseBranch: string,
  headBranch: string,
  error: string,
) =>
  `Error while getting base commit with command 'git merge-base ${baseBranch} ${headBranch}': ${error}`;
export const TXT_CI_INFO = (ciInfo: CiInfo) => {
  let result = "";
  if (ciInfo.ci !== CI.NONE) {
    result += `CI: ${ciInfo.ci}\n`;
  }
  if (ciInfo.branch) {
    result += `Branch: ${ciInfo.branch}\n`;
  }
  if (ciInfo.tag) {
    result += `Tag: ${ciInfo.tag}\n`;
  }
  if (ciInfo.pullRequestNumber) {
    result += `Pull request number: ${ciInfo.pullRequestNumber}\n`;
  }
  if (ciInfo.commit) {
    result += `Commit: ${ciInfo.commit}\n`;
  }
  if (ciInfo.baseCommit) {
    result += `Base commit: ${ciInfo.baseCommit}\n`;
  }
  return result;
};
