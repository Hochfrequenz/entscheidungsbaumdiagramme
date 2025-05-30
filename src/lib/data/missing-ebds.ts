export interface EbdData {
  ebd_code: string;
  ebd_name: string;
}

// EBDs that have either not been scraped by EBDamame or converted to .svg by rEBDhuhn
// generated by running EBD toolchain workflow https://github.com/Hochfrequenz/edi_energy_mirror/actions/workflows/ebdamame_rebdhuhn.yml
// missing EBDs are clustered according to their associated error handler
export const FV2504_MISSING_EBD: EbdData[] = [
  {
    ebd_code: "E_0043",
    ebd_name: "E_0043_Datenstatus nach Vorliegen einer Prüfmitteilung vergeben",
  },
  {
    ebd_code: "E_0055",
    ebd_name: "E_0055_Datenstatus nach Vorliegen einer Prüfmitteilung vergeben",
  },
  {
    ebd_code: "E_0058",
    ebd_name: "E_0058_Datenstatus nach Vorliegen einer Prüfmitteilung vergeben",
  },
  {
    ebd_code: "E_0060",
    ebd_name:
      "E_0060_Datenstatus nach Eingang eines Deltazeitreihenübertrags vergeben",
  },
  {
    ebd_code: "E_0061",
    ebd_name: "E_0061_Datenstatus nach Vorliegen einer Prüfmitteilung vergeben",
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

  { ebd_code: "E_0256", ebd_name: "E_0256_Bestellung prüfen" },

  { ebd_code: "E_0452", ebd_name: "E_0452_Nicht-Zahlungsavise prüfen" },
];

// extract only EBD codes (required for handling of GET requests of SVGs/PUML)
export const FV2504_MISSING_EBD_CODES = FV2504_MISSING_EBD.map(
  (ebd) => ebd.ebd_code,
);

export function isMissingEbd(formatVersion: string, ebdCode: string): boolean {
  return (
    formatVersion === "FV2504" && FV2504_MISSING_EBD_CODES.includes(ebdCode)
  );
}
