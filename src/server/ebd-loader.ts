import { readdirSync, readFileSync } from "fs";
import { join } from "path";

import type { EbdNameExtended, MetaData } from "$lib/types/metadata";

let ebdFiles: Record<string, string[]> | null = null;
let ebdFullName: Record<string, EbdNameExtended[]> | null = null;
let ebdMetadata: Record<string, Record<string, MetaData>> | null = null;

// mapping of FVs where the BDEW skipped EBD related updates
const skippedFormatVersionToInsteadFormatVersionMap: Record<string, string> = {
  // key = skipped format version; value = previous (still valid) format version
  FV2410: "FV2404",
};

// hardcoded missing EBDs of FV2504
const missingEbds: Record<string, EbdNameExtended[]> = {
  FV2504: [
    {
      ebd_code: "E_0026",
      ebd_name:
        "E_0026_Datenstatus nach erfolgter Bilanzkreisabrechnung vergeben",
    },
    {
      ebd_code: "E_0042",
      ebd_name:
        "E_0042_Datenstatus nach Eingang einer Bilanzkreissummenzeitreihe (Kategorie B) vergeben",
    },
    {
      ebd_code: "E_0043",
      ebd_name:
        "E_0043_Datenstatus nach Vorliegen einer Prüfmitteilung vergeben",
    },
    {
      ebd_code: "E_0055",
      ebd_name:
        "E_0055_Datenstatus nach Vorliegen einer Prüfmitteilung vergeben",
    },
    {
      ebd_code: "E_0058",
      ebd_name:
        "E_0058_Datenstatus nach Vorliegen einer Prüfmitteilung vergeben",
    },
    {
      ebd_code: "E_0060",
      ebd_name:
        "E_0060_Datenstatus nach Eingang eines Deltazeitreihenübertrags vergeben",
    },
    {
      ebd_code: "E_0061",
      ebd_name:
        "E_0061_Datenstatus nach Vorliegen einer Prüfmitteilung vergeben",
    },
    {
      ebd_code: "E_0077",
      ebd_name:
        "E_0077_Datenstatus nach Vorliegen einer Prüfmitteilung zur AAÜZ vergeben",
    },
    {
      ebd_code: "E_0084",
      ebd_name:
        "E_0084_Datenstatus nach Vorliegen einer Prüfmitteilung zur AAÜZ vergeben",
    },
    { ebd_code: "E_0210", ebd_name: "E_0210_Rechnung verarbeiten" },
    { ebd_code: "E_0218", ebd_name: "E_0218_Berechnungsformel prüfen" },
    { ebd_code: "E_0256", ebd_name: "E_0256_Bestellung prüfen" },
    { ebd_code: "E_0259", ebd_name: "E_0259_Rechnung verarbeiten" },
    {
      ebd_code: "E_0264",
      ebd_name: "E_0264_Rechnung einer für den ESA erbrachten Leistung prüfen",
    },
    {
      ebd_code: "E_0266",
      ebd_name:
        "E_0266_erneut Rechnung einer für den ESA erbrachten Leistung prüfen",
    },
    { ebd_code: "E_0406", ebd_name: "E_0406_Netznutzungsrechnung prüfen" },
    {
      ebd_code: "E_0407",
      ebd_name: "E_0407_erneut Netznutzungsabrechnung prüfen",
    },
    { ebd_code: "E_0408", ebd_name: "E_0408_Änderung vom NB prüfen" },
    {
      ebd_code: "E_0409",
      ebd_name:
        "E_0409_Änderung vom NB prüfen (Basiert auf EBD: E_0408_Änderung vom NB prüfen)",
    },
    {
      ebd_code: "E_0410",
      ebd_name:
        "E_0410_Änderung vom LF prüfen (Basiert auf EBD: E_0408_Änderung vom NB prüfen)",
    },
    {
      ebd_code: "E_0412",
      ebd_name:
        "E_0412_Änderung vom MSB prüfen (Basiert auf EBD: E_0408_Änderung vom NB prüfen)",
    },
    {
      ebd_code: "E_0415",
      ebd_name:
        "E_0415_Änderung vom MSB prüfen (Basiert auf EBD: E_0408_Änderung vom NB prüfen)",
    },
    { ebd_code: "E_0452", ebd_name: "E_0452_Nicht-Zahlungsavise prüfen" },
    {
      ebd_code: "E_0515",
      ebd_name: "E_0515_Rechnung der Leistungen des Preisblatts A prüfen",
    },
    {
      ebd_code: "E_0517",
      ebd_name:
        "E_0517_erneut Rechnung der Leistungen des Preisblatts A prüfen",
    },
    {
      ebd_code: "E_0519",
      ebd_name: "E_0519_Rechnung der Leistungen des Preisblatts A prüfen",
    },
    {
      ebd_code: "E_0521",
      ebd_name:
        "E_0521_erneut Rechnung der Leistungen des Preisblatts A prüfen",
    },
    { ebd_code: "E_0524", ebd_name: "E_0524_Anfrage prüfen" },
    { ebd_code: "E_0531", ebd_name: "E_0531_Anfrage prüfen" },
    { ebd_code: "E_0552", ebd_name: "E_0552_Reklamation prüfen" },
    { ebd_code: "E_0553", ebd_name: "E_0553_Reklamation prüfen" },
    { ebd_code: "E_0554", ebd_name: "E_0554_Reklamation prüfen" },
    {
      ebd_code: "E_0566",
      ebd_name:
        "E_0566_Rechnung Messtellenbetrieb mit iMS gegenüber dem NB prüfen",
    },
    {
      ebd_code: "E_0568",
      ebd_name:
        "E_0568_erneut Rechnung Messtellenbetrieb mit iMS gegenüber dem NB prüfen",
    },
    {
      ebd_code: "E_0572",
      ebd_name:
        "E_0572_Änderung vom NB prüfen (Basiert auf EBD: E_0408_Änderung vom NB prüfen)",
    },
    {
      ebd_code: "E_0574",
      ebd_name: "E_0574_Stammdaten zur Bilanzkreistreue prüfen",
    },
    {
      ebd_code: "E_0578",
      ebd_name:
        "E_0578_Änderung vom LF prüfen (Basiert auf EBD: E_0408_Änderung vom NB prüfen)",
    },
    {
      ebd_code: "E_0583",
      ebd_name:
        "E_0583_Änderung vom MSB prüfen (Basiert auf EBD: E_0408_Änderung vom NB prüfen)",
    },
    { ebd_code: "E_0594", ebd_name: "E_0594_Anfrage vom LF prüfen" }, // PRIO 1 FIX
    { ebd_code: "E_0595", ebd_name: "E_0595_Bestellung prüfen" },
    { ebd_code: "E_0607", ebd_name: "E_0607_Abmeldung prüfen" },
    { ebd_code: "E_0608", ebd_name: "E_0608_Anmeldung einer Zuordnung" },
    {
      ebd_code: "E_0610",
      ebd_name:
        "E_0610_Abrechnungsdaten Netznutzungsabrechnung prüfen (Basiert auf EBD: E_0408_Änderung vom NB prüfen)",
    },
    {
      ebd_code: "E_0611",
      ebd_name:
        "E_0611_Abrechnungsdaten Bilanzkreisabrechnung prüfen (Basiert auf EBD: E_0408_Änderung vom NB prüfen)",
    },
    {
      ebd_code: "E_0612",
      ebd_name: "E_0612_Abrechnungsdaten Bilanzkreisabrechnung prüfen",
    },
    { ebd_code: "E_0614", ebd_name: "E_0614_Kündigung Vertrag prüfen" },
    {
      ebd_code: "E_0622",
      ebd_name: "E_0622_Prüfen, ob Anmeldung direkt ablehnbar",
    },
    {
      ebd_code: "E_0639",
      ebd_name:
        "E_0639_Änderung vom MSB prüfen (Basiert auf EBD: E_0408_Änderung vom NB prüfen)",
    },
    { ebd_code: "E_0802", ebd_name: "E_0802_aggregierte MMM-Rechnung prüfen" },
  ],
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

      // include hardcoded missing EBDs in sorting algorithm
      if (formatVersion === "FV2504" && missingEbds["FV2504"]) {
        const additionalEbdCodes = missingEbds["FV2504"].map(
          (ebd) => ebd.ebd_code,
        );
        ebds[formatVersion] = [
          ...ebds[formatVersion],
          ...additionalEbdCodes,
        ].sort((a, b) => a.localeCompare(b));
      }
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

      // include names of hardcoded missing EBDs of FV2504
      if (formatVersion === "FV2504" && missingEbds["FV2504"]) {
        const additionalEbd = missingEbds["FV2504"].find(
          (ebd) => ebd.ebd_code === ebdCode,
        );
        if (additionalEbd) {
          return additionalEbd;
        }
      }

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

export function getEbdMetadata(): Record<string, Record<string, MetaData>> {
  if (ebdMetadata) return ebdMetadata;

  const ebds = getEbds();
  const metadata: Record<string, Record<string, MetaData>> = {};

  for (const formatVersion of Object.keys(ebds)) {
    const versionPath = join(process.cwd(), "static", "ebd", formatVersion);
    metadata[formatVersion] = {};

    try {
      const files = readdirSync(versionPath);
      const jsonFiles = files.filter((file) => file.endsWith(".json"));

      for (const jsonFile of jsonFiles) {
        const ebdCode = jsonFile.replace(".json", "");
        const jsonPath = join(versionPath, jsonFile);
        try {
          const parseMetaData = JSON.parse(
            readFileSync(jsonPath, "utf-8"),
          ) as MetaData;
          metadata[formatVersion][ebdCode] = parseMetaData;
        } catch (error) {
          console.warn(`no metadata available for ${ebdCode}: ${error}`);
        }
      }
    } catch (error) {
      console.error(`error reading metadata for ${formatVersion}:`, error);
    }
  }

  ebdMetadata = metadata;
  return metadata;
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

function getChaptersForFormatVersion(formatVersion: string): string[] {
  const staticPath = join(process.cwd(), "static", "ebd");
  const versionPath = join(staticPath, formatVersion);
  const chapters = new Set<string>();

  try {
    const files = readdirSync(versionPath);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    for (const jsonFile of jsonFiles) {
      const jsonPath = join(versionPath, jsonFile);
      const metadata = JSON.parse(readFileSync(jsonPath, "utf-8")) as MetaData;
      if (metadata.metadata.chapter?.trim()) {
        chapters.add(metadata.metadata.chapter);
      }
    }

    return Array.from(chapters).sort();
  } catch (error) {
    console.error(`no chapters available for ${formatVersion}:`, error);
    return [];
  }
}

export function getChapters(): Record<string, string[]> {
  const ebds = getEbds();
  const chapters: Record<string, string[]> = {};

  for (const formatVersion of Object.keys(ebds)) {
    chapters[formatVersion] = getChaptersForFormatVersion(formatVersion);
  }

  return chapters;
}
