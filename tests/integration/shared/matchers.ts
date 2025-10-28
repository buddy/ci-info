import { expect } from "vitest";
import type { CI, CiInfo } from "../../../src/index.js";

export function assertCiType(ciInfo: CiInfo, expectedType: CI) {
  expect(ciInfo.ci).toBe(expectedType);
}

export function assertValidBranchName(branchName: string) {
  expect(branchName).toBeTruthy();
  expect(typeof branchName).toBe("string");
  expect(branchName.length).toBeGreaterThan(0);
}

export function assertValidCommitHash(commitHash: string) {
  expect(commitHash).toBeTruthy();
  expect(typeof commitHash).toBe("string");
  expect(commitHash).toMatch(/^[0-9a-f]+$/i);
  expect(commitHash.length).toBeGreaterThanOrEqual(7);
}

export function assertRequiredFields(ciInfo: CiInfo, fields: string[]) {
  for (const field of fields) {
    const value = (ciInfo as unknown as Record<string, unknown>)[field];
    expect(value, `Field "${field}" should exist and be truthy`).toBeTruthy();
  }
}

export function assertValidCommitDetails(ciInfo: CiInfo) {
  if (ciInfo.commitDetails) {
    expect(ciInfo.commitDetails.authorName).toBeTruthy();
    expect(ciInfo.commitDetails.authorEmail).toMatch(/\S+@\S+/);
    expect(ciInfo.commitDetails.authorDate).toBeTruthy();
    expect(ciInfo.commitDetails.message).toBeTruthy();
  }
}

export function assertFormattedOutput(formatted: string, ciInfo: CiInfo) {
  expect(formatted).toContain(ciInfo.ci);
  if (ciInfo.branch) {
    expect(formatted).toContain(ciInfo.branch);
  }
  if (ciInfo.commit) {
    expect(formatted).toContain(ciInfo.commit);
  }
}
