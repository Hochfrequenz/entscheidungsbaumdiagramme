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
const skippedFormatVersionToInsteadFormatVersionMap: Record<string, string> = {
  // key = skipped format version; value = previous (still valid) format version
  FV2410: "FV2404",
};

function formatVersion(version: string): FormatVersion {
  const formattedVersion = version.startsWith("FV") ? version : `FV${version}`;
  const mappedVersion =
    skippedFormatVersionToInsteadFormatVersionMap[formattedVersion] ||
    formattedVersion;
  const versionNumber = mappedVersion.replace("FV", "");
  const formatVersionDate = formatVersionMap[versionNumber];

  return {
    code: mappedVersion,
    detailedFormatVersion: `${formatVersionDate} (${mappedVersion})`,
  };
}

// fetch submodule data from their correct location depending on the environment
export function getFormatVersions(): FormatVersion[] {
  const assetsPath = [
    ["static", "ebd"], // vite dev server
    ["build", "static", "ebd"], // vite preview
  ];

  let dirents = null;

  for (const pathSegments of assetsPath) {
    const currentPath = join(process.cwd(), ...pathSegments);
    try {
      dirents = readdirSync(currentPath, { withFileTypes: true });
      break;
    } catch {
      continue;
    }
  }

  if (!dirents) {
    console.error("submodule data not found.");
    return [];
  }

  const uniqueFormatVersion = new Set<string>();

  return dirents
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => formatVersion(dirent.name))
    .filter((version) => {
      if (
        Object.keys(skippedFormatVersionToInsteadFormatVersionMap).includes(
          version.code,
        )
      ) {
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
