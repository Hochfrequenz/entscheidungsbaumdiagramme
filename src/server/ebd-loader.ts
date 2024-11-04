import { readdirSync } from "fs";
import { join } from "path";

const skippedFormatVersionToInsteadFormatVersionMap: Record<string, string> = {
  // key = skipped format version; value = previous (still valid) format version
  FV2410: "FV2404",
};

export function getEbds(): Record<string, string[]> {
  const staticPath = join(process.cwd(), "static", "ebd");
  const ebds: Record<string, string[]> = {};

  try {
    const formatVersions = readdirSync(staticPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && dirent.name.startsWith("FV"))
      .map((dirent) => dirent.name);

    for (const formatVersion of formatVersions) {
      if (skippedFormatVersionToInsteadFormatVersionMap[formatVersion]) {
        continue;
      }

      const versionPath = join(staticPath, formatVersion);
      const files = readdirSync(versionPath);

      ebds[formatVersion] = files
        .filter((file) => file.endsWith(".svg"))
        .map((file) => file.replace(".svg", ""))
        .sort((a, b) => a.localeCompare(b));
    }

    return ebds;
  } catch (error) {
    console.error("error reading EBDs from submodule:", error);
    return {};
  }
}
