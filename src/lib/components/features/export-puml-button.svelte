<script lang="ts">
  import { onMount } from "svelte";

  import { base } from "$app/paths";
  import { IconDownload } from "$lib/components";

  export let currentFormatVersion: string = "";
  export let currentEbd: string = "";
  export let isDisabled: boolean = false;

  let isExportReady = true;
  let cooldownTimer: ReturnType<typeof setTimeout>;
  let remainingSeconds = 0;
  let downloadStarted = false;
  let isPumlAvailable = false;

  // hardcoded missing EBDs of FV2504
  const missingEbds: Record<
    string,
    Array<{ ebd_code: string; ebd_name: string }>
  > = {
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
        ebd_name:
          "E_0264_Rechnung einer für den ESA erbrachten Leistung prüfen",
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
      {
        ebd_code: "E_0802",
        ebd_name: "E_0802_aggregierte MMM-Rechnung prüfen",
      },
    ],
  };

  onMount(() => {
    return () => {
      if (cooldownTimer) clearTimeout(cooldownTimer);
    };
  });

  // check if PUML file is availabe (roughly 75% of SVGs have an associated PUML file)
  $: if (currentFormatVersion && currentEbd) {
    checkPumlAvailability();
  }

  async function checkPumlAvailability() {
    if (!currentFormatVersion || !currentEbd) {
      isPumlAvailable = false;
      return;
    }

    if (
      currentFormatVersion === "FV2504" &&
      missingEbds["FV2504"]?.some((ebd) => ebd.ebd_code === currentEbd)
    ) {
      isPumlAvailable = false;
      return;
    }

    const pumlPath = `${base}/ebd/${currentFormatVersion}/${currentEbd}.puml`;

    try {
      const response = await fetch(pumlPath, { method: "HEAD" });
      isPumlAvailable = response.ok;
    } catch (err) {
      console.error(`Error checking PUML availability: ${err}`);
      isPumlAvailable = false;
    }
  }

  // 5 seconds cooldown to prevent download from being spammed
  function startCooldownTimer() {
    remainingSeconds = 5;
    downloadStarted = true;

    const updateTimer = () => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        cooldownTimer = setTimeout(updateTimer, 1000);
      } else {
        isExportReady = true;
        downloadStarted = false;
      }
    };

    cooldownTimer = setTimeout(updateTimer, 1000);
  }

  async function handleExport() {
    if (
      isDisabled ||
      !isExportReady ||
      !currentFormatVersion ||
      !currentEbd ||
      !isPumlAvailable
    )
      return;

    isExportReady = false;
    const pumlPath = `${base}/ebd/${currentFormatVersion}/${currentEbd}.puml`;

    try {
      const response = await fetch(pumlPath);
      if (!response.ok) {
        throw new Error(`http error: ${response.status}`);
      }
      const pumlContent = await response.text();

      const blob = new Blob([pumlContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentFormatVersion}_${currentEbd}.puml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      startCooldownTimer();
    } catch (err) {
      console.error(`error exporting puml: ${err}`);
      isExportReady = true;
    }
  }
</script>

{#if isPumlAvailable}
  <button
    on:click={handleExport}
    class="flex flex-row items-center gap-2 rounded-full bg-secondary text-[16px] py-3 px-5 text-black/70 transition-opacity duration-200 whitespace-nowrap min-w-[150px] justify-center"
    class:opacity-30={isDisabled || !isExportReady}
    class:cursor-not-allowed={!isExportReady}
    disabled={isDisabled || !isExportReady}
  >
    {#if downloadStarted}
      {remainingSeconds} s
    {:else}
      <IconDownload /> Export PUML
    {/if}
  </button>
{/if}
