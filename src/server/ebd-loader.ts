import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import type { EbdNameExtended, MetaData } from "$lib/types/metadata";

// mapping of FVs where the BDEW skipped EBD related updates
const skippedFormatVersionToInsteadFormatVersionMap: Record<string, string> = {
  // key = skipped format version; value = previous (still valid) format version
  FV2410: "FV2404",
};

export function getEbds(): Record<string, EbdNameExtended[]> {
  const staticPath = join(process.cwd(), "static", "ebd");
  const ebds: Record<string, EbdNameExtended[]> = {};

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
        .map((file) => {
          const ebdCode = file.replace(".svg", "");
          let ebd_name = ebdCode; // by default, EBD <input> only shows ebd_code "E_XXXX"

          try {
            const jsonPath = join(versionPath, `${ebdCode}.json`);
            const jsonContent = readFileSync(jsonPath, "utf-8");
            const parseMetaData = JSON.parse(jsonContent) as MetaData;
            // only update extended ebd_name if corresponding metadata <value> of ebd_name <key> exists
            if (
              parseMetaData.metadata.chapter &&
              parseMetaData.metadata.chapter.trim()
            ) {
              ebd_name = `${ebdCode}_${parseMetaData.metadata.chapter}`;
            }
          } catch (error) {
            console.warn(`no metadata available for ${ebdCode}: ${error}`);
          }

          return {
            ebd_code: ebdCode,
            ebd_name,
          };
        })
        .sort((a, b) => a.ebd_code.localeCompare(b.ebd_code));
    }

    return ebds;
  } catch (error) {
    console.error("error reading EBDs from submodule:", error);
    return {};
  }
}
