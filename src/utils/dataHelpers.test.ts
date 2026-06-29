import { describe, it, expect } from "vitest";
import { filterProfiles, extractProfiles } from "../utils/dataHelpers";
import type { UserProfileSummary } from "../types";

describe("dataHelpers - filterProfiles", () => {
  const mockProfiles: UserProfileSummary[] = [
    {
      user_id: "1",
      username: "cristiano",
      fullname: "Cristiano Ronaldo",
      url: "",
      picture: "",
      is_verified: true,
      followers: 600000000,
    },
    {
      user_id: "2",
      username: "mrbeast",
      fullname: "Jimmy Donaldson",
      url: "",
      picture: "",
      is_verified: true,
      followers: 300000000,
    },
  ];

  it("should return all profiles when query is empty", () => {
    expect(filterProfiles(mockProfiles, "")).toHaveLength(2);
  });

  it("should filter case-insensitively by username", () => {
    const result = filterProfiles(mockProfiles, "CRISTIANO");
    expect(result).toHaveLength(1);
    expect(result[0].username).toBe("cristiano");
  });

  it("should filter case-insensitively by fullname", () => {
    const result = filterProfiles(mockProfiles, "jimmy");
    expect(result).toHaveLength(1);
    expect(result[0].username).toBe("mrbeast");
  });

  it("should extract profiles for instagram platform", () => {
    const profiles = extractProfiles("instagram");
    expect(profiles.length).toBeGreaterThan(0);
  });
});
