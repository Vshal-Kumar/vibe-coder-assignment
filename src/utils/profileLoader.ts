import type { ProfileDetailResponse } from "@/types";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  const path = `../assets/data/profiles/${username}.json`;
  let loader = profileModules[path];

  if (!loader) {
    // Try case-insensitive lookup
    const targetKey = username.toLowerCase() + ".json";
    const matchedKey = Object.keys(profileModules).find((key) =>
      key.toLowerCase().endsWith(`/${targetKey}`)
    );
    if (matchedKey) {
      loader = profileModules[matchedKey];
    }
  }

  if (!loader) {
    return null;
  }

  const result = await loader();
  const data =
    (result as { default?: ProfileDetailResponse }).default ?? result;
  return data as ProfileDetailResponse;
}
