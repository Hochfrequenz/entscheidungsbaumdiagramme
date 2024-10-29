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

function formatVersion(version: string): FormatVersion {
  const versionNumber = version.slice(2);
  const formatVersionDate = formatVersionMap[versionNumber];
  return {
    code: version,
    detailedFormatVersion: `${formatVersionDate} (${version})`,
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

  return dirents
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => formatVersion(dirent.name))
    .sort((a, b) => b.code.localeCompare(a.code));
}
