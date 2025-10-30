export enum CI {
  BUDDY = "BUDDY",
  GITHUB_ACTION = "GITHUB_ACTION",
  CIRCLE_CI = "CIRCLE_CI",
  NONE = "NONE",
}

export enum REF_TYPE {
  BRANCH = "BRANCH",
  TAG = "TAG",
  PULL_REQUEST = "PULL_REQUEST",
  WILDCARD = "WILDCARD",
}

export interface ICommitDetails {
  authorName?: string;
  authorEmail?: string;
  authorDate?: number;
  message?: string;
}

export type CiInfo =
  | IBuddyCiInfo
  | IGithubActionCiInfo
  | ICircleCiInfo
  | ICustomCiInfo;

export interface ISharedCiInfo {
  ci: CI;
  refType: REF_TYPE;
  refName?: string;
  branch?: string;
  pullRequestNumber?: number;
  tag?: string;
  commit?: string;
  baseCommit?: string;
  commitDetails?: ICommitDetails;
}

export interface IBuddyCiInfo extends ISharedCiInfo {
  ci: CI.BUDDY;
  pipelineName?: string;
  pipelineId?: number;
  actionId?: number;
  executionId?: string;
  actionExecutionId?: string;
  invokerId?: number;
}

export interface IGithubActionCiInfo extends ISharedCiInfo {
  ci: CI.GITHUB_ACTION;
  executionUrl?: string;
}

export interface ICircleCiInfo extends ISharedCiInfo {
  ci: CI.CIRCLE_CI;
  executionUrl?: string;
}

export interface ICustomCiInfo extends ISharedCiInfo {
  ci: CI.NONE;
}
