import {
  EdifactFormatVersion,
  getEdifactFormatVersionLabel,
} from "@hochfrequenz/efoli";
import { readdirSync } from "fs";
import { join } from "path";

import { EXCLUDED_FORMAT_VERSIONS } from "./excluded-format-versions";

type FormatVersion = {
  code: string;
  detailedFormatVersion: string;
};

function formatVersion(version: string): FormatVersion {
  const code = version.startsWith("FV") ? version : `FV${version}`;
  let label: string;
  try {
    label = getEdifactFormatVersionLabel(code as EdifactFormatVersion);
  } catch {
    label = code;
  }
  return {
    code,
    detailedFormatVersion: `${label} (${code})`,
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
        if ((EXCLUDED_FORMAT_VERSIONS as string[]).includes(version.code))
          return false;

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
