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
  "2504": "Juni 2025",
  "2510": "Oktober 2025",
};

// older FVs < FV2404 that are excluded from <selects>
const EXCLUDED_FORMAT_VERSIONS = [
  "FV2104",
  "FV2110",
  "FV2204",
  "FV2210",
  "FV2304",
  "FV2310",
];

function formatVersion(version: string): FormatVersion {
  const formattedVersion = version.startsWith("FV") ? version : `FV${version}`;
  const mappedVersion = formattedVersion;
  const versionNumber = mappedVersion.replace("FV", "");
  const formatVersionDate = formatVersionMap[versionNumber];

  return {
    code: mappedVersion,
    detailedFormatVersion: `${formatVersionDate} (${mappedVersion})`,
  };
}

export function getFormatVersions(): FormatVersion[] {
  const staticPath = join(process.cwd(), "static", "ebd");

  try {
    const dirents = readdirSync(staticPath, { withFileTypes: true });
    const uniqueFormatVersion = new Set<string>();

    return dirents
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => formatVersion(dirent.name))
      .filter((version) => {
        if (EXCLUDED_FORMAT_VERSIONS.includes(version.code)) return false;

        if (uniqueFormatVersion.has(version.code)) return false;
        uniqueFormatVersion.add(version.code);
        return true;
      })
      .sort((a, b) => a.code.localeCompare(b.code));
  } catch (error) {
    console.error("error reading format versions from submodule:", error);
    return [];
  }
}
