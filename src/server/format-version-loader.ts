import { readdirSync } from "fs";
import { join } from "path";

type FormatVersion = {
  code: string;
  detailedFormatVersion: string;
};

const formatVersionMap: Record<string, string> = {
  "2104": "April 2021",
  "2110": "Oktober 2021",
  "2204": "April 2022",
  "2210": "Oktober 2022",
  "2304": "April 2023",
  "2310": "Oktober 2023",
  "2404": "April 2024",
  "2410": "Oktober 2024",
  "2504": "April 2025",
  "2510": "Oktober 2025",
};

// mapping of FVs where the BDEW skipped EBD related updates
const skippedFormatVersionMap: Record<string, string> = {
  FV2410: "FV2404",
};

function formatVersion(version: string): FormatVersion {
  const formattedVersion = version.startsWith("FV") ? version : `FV${version}`;
  const mappedVersion =
    skippedFormatVersionMap[formattedVersion] || formattedVersion;
  const versionNumber = mappedVersion.replace("FV", "");
  const formatVersionDate = formatVersionMap[versionNumber];

  return {
    code: mappedVersion,
    detailedFormatVersion: `${formatVersionDate} (${mappedVersion})`,
  };
}

function tryReadDir(path: string) {
  try {
    return readdirSync(path, { withFileTypes: true });
  } catch {
    return null;
  }
}

// fetch submodule data from either /static/ebd (sveltekit "dev server") or /build/ebd (sveltekit "preview")
export function getFormatVersions(): FormatVersion[] {
  const staticPath = join(process.cwd(), "static", "ebd");
  const buildPath = join(process.cwd(), "build", "ebd");

  const dirents = tryReadDir(staticPath) || tryReadDir(buildPath);

  if (!dirents) {
    console.error("submodule data not found.");
    return [];
  }

  const uniqueFormatVersion = new Set<string>();
  return dirents
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => formatVersion(dirent.name))
    .filter((version) => {
      if (Object.keys(skippedFormatVersionMap).includes(version.code)) {
        return false;
      }
      if (uniqueFormatVersion.has(version.code)) {
        return false;
      }
      uniqueFormatVersion.add(version.code);
      return true;
    })
    .sort((a, b) => b.code.localeCompare(a.code));
}
