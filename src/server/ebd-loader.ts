import { readdirSync } from "fs";
import { join } from "path";

const skippedFormatVersionToInsteadFormatVersionMap: Record<string, string> = {
  // key = skipped format version; value = previous (still valid) format version
  FV2410: "FV2404",
};

function tryReadDir(path: string) {
  try {
    return readdirSync(path);
  } catch {
    return null;
  }
}

// fetch submodule data from either /static/ebd (sveltekit "dev server") or /build/ebd (sveltekit "preview")
export function getEbds(): Record<string, string[]> {
  const staticPath = join(process.cwd(), "static", "ebd");
  const buildPath = join(process.cwd(), "build", "static", "ebd");
  const ebds: Record<string, string[]> = {};

  const basePath = tryReadDir(staticPath) ? staticPath : buildPath;
  const formatVersions = tryReadDir(basePath);

  if (!formatVersions) {
    console.error("submodule data not found.");
    return {};
  }

  try {
    for (const formatVersion of formatVersions) {
      if (skippedFormatVersionToInsteadFormatVersionMap[formatVersion]) {
        continue;
      }

      const versionPath = join(basePath, formatVersion);
      const files = tryReadDir(versionPath);

      if (files) {
        ebds[formatVersion] = files
          .filter((file) => file.endsWith(".svg"))
          .map((file) => file.replace(".svg", ""))
          .sort((a, b) => a.localeCompare(b));
      }
    }

    return ebds;
  } catch (error) {
    console.error("Error loading EBDs", error);
    return {};
  }
}
