import { readdirSync } from "fs";
import { join } from "path";

// mapping of FVs where the BDEW skipped EBD related updates
const skippedFormatVersionToInsteadFormatVersionMap: Record<string, string> = {
  // key = skipped format version; value = previous (still valid) format version
  FV2410: "FV2404",
};

// fetch submodule data from their correct location depending on the environment
export function getEbds(): Record<string, string[]> {
  const assetsPath = [
    ["static", "ebd"], // vite dev server
    ["build", "static", "ebd"], // vite preview
  ];

  let formatVersions = null;
  let basePath = "";

  for (const pathSegments of assetsPath) {
    const currentPath = join(process.cwd(), ...pathSegments);
    try {
      formatVersions = readdirSync(currentPath);
      basePath = currentPath;
      break;
    } catch {
      continue;
    }
  }

  if (!formatVersions) {
    console.error("submodule data not found.");
    return {};
  }

  const ebds: Record<string, string[]> = {};

  try {
    for (const formatVersion of formatVersions) {
      if (skippedFormatVersionToInsteadFormatVersionMap[formatVersion]) {
        continue;
      }

      const versionPath = join(basePath, formatVersion);

      try {
        const files = readdirSync(versionPath);
        ebds[formatVersion] = files
          .filter((file) => file.endsWith(".svg"))
          .map((file) => file.replace(".svg", ""))
          .sort((a, b) => a.localeCompare(b));
      } catch {
        continue;
      }
    }

    return ebds;
  } catch {
    return {};
  }
}
