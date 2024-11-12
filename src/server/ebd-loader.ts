import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import type { EbdNameExtended, MetaData } from "$lib/types/metadata";

let ebdFiles: Record<string, string[]> | null = null;
let ebdFullName: Record<string, EbdNameExtended[]> | null = null;

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
export function getEbdNames(): Record<string, EbdNameExtended[]> {
  if (ebdFullName) return ebdFullName;

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

  ebdFullName = result;
  return result;
}

// fetches available roles from EBD metadata for a given format version
function getRolesForFormatVersion(formatVersion: string): string[] {
  const staticPath = join(process.cwd(), "static", "ebd");
  const versionPath = join(staticPath, formatVersion);
  const roles = new Set<string>();

  try {
    const files = readdirSync(versionPath);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    for (const jsonFile of jsonFiles) {
      const jsonPath = join(versionPath, jsonFile);
      const metadata = JSON.parse(readFileSync(jsonPath, "utf-8")) as MetaData;
      if (metadata.metadata.role?.trim()) {
        roles.add(metadata.metadata.role);
      }
    }

    return Array.from(roles).sort();
  } catch (error) {
    console.error(`no roles avaialble for ${formatVersion}:`, error);
    return [];
  }
}

export function getRoles(): Record<string, string[]> {
  const ebds = getEbds();
  const roles: Record<string, string[]> = {};

  for (const formatVersion of Object.keys(ebds)) {
    roles[formatVersion] = getRolesForFormatVersion(formatVersion);
  }

  return roles;
}
