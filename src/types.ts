export enum CI {
    BUDDY = 'BUDDY',
    GITHUB_ACTION = 'GITHUB_ACTION',
    CIRCLE_CI = 'CIRCLE_CI',
    NONE = 'NONE',
  }
  
  export type CiInfo =
    | IBuddyCiInfo
    | IGithubActionCiInfo
    | ICircleCiInfo
    | ICustomCiInfo;
  
  export interface IBuddyCiInfo {
    ci: CI.BUDDY;
    branch?: string;
    pullRequestNumber?: number;
    tag?: string;
    commit?: string;
    baseCommit?: string;
    pipelineName?: string;
    pipelineId?: number;
    actionId?: number;
    executionId?: string;
    invokerId?: number;
    commitDetails?: ICommitDetails;
  }
  
  export interface IGithubActionCiInfo {
    ci: CI.GITHUB_ACTION;
    branch?: string;
    pullRequestNumber?: number;
    tag?: string;
    commit?: string;
    baseCommit?: string;
    commitDetails?: ICommitDetails;
    executionUrl?: string;
  }
  
  export interface ICircleCiInfo {
    ci: CI.CIRCLE_CI;
    branch?: string;
    pullRequestNumber?: number;
    tag?: string;
    commit?: string;
    baseCommit?: string;
    commitDetails?: ICommitDetails;
    executionUrl?: string;
  }
  
  export interface ICustomCiInfo {
    ci: CI.NONE;
    branch?: string;
    tag?: string;
    pullRequestNumber?: number;
    commit?: string;
    baseCommit?: string;
    commitDetails?: ICommitDetails;
  }
  
  export interface ICommitDetails {
    authorName?: string;
    authorEmail?: string;
    authorDate?: number;
    message?: string;
  }
  