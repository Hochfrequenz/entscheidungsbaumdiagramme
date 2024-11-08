import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import type { EbdNameExtended, MetaData } from "$lib/types/metadata";

let ebdFiles: Record<string, string[]> | null = null;
let ebdsWithMetadata: Record<string, EbdNameExtended[]> | null = null;

// mapping of FVs where the BDEW skipped EBD related updates
const skippedFormatVersionToInsteadFormatVersionMap: Record<string, string> = {
  // key = skipped format version; value = previous (still valid) format version
  FV2410: "FV2404",
};

// fetches EBD files and associated metadata
function getEbds(): Record<string, string[]> {
  if (ebdFiles) return ebdFiles;

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

    ebdFiles = ebds;
    return ebds;
  } catch (error) {
    console.error("error reading EBDs from submodule:", error);
    return {};
  }
}

// Export function for SSG
export function getEbdFiles(): Record<string, string[]> {
  return getEbds();
}

// export function for UI, including EBDs and associated metadata
export function getEbdsWithMetadata(): Record<string, EbdNameExtended[]> {
  if (ebdsWithMetadata) return ebdsWithMetadata;

  const ebds = getEbds();
  const result: Record<string, EbdNameExtended[]> = {};

  for (const [formatVersion, ebdCodes] of Object.entries(ebds)) {
    const versionPath = join(process.cwd(), "static", "ebd", formatVersion);

    result[formatVersion] = ebdCodes.map((ebdCode) => {
      let ebd_name = ebdCode; // by default, display ebd_code if ebd_name is n/a

      try {
        const jsonPath = join(versionPath, `${ebdCode}.json`);
        const parseMetaData = JSON.parse(
          readFileSync(jsonPath, "utf-8"),
        ) as MetaData;
        // if ebd_name != n/a, show ebd_name instead of ebd_code
        if (parseMetaData.metadata.ebd_name?.trim()) {
          ebd_name = `${parseMetaData.metadata.ebd_name}`;
        }
      } catch (error) {
        console.warn(`no metadata available for ${ebdCode}: ${error}`);
      }

      return { ebd_code: ebdCode, ebd_name };
    });
  }

  ebdsWithMetadata = result;
  return result;
}
