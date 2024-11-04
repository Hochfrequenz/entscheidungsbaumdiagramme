<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import {
    EbdSelect,
    ExportButton,
    FormatVersionSelect,
    IconLogo,
  } from "$lib/components";
  import type { EbdNameExtended } from "$lib/types/metadata";

  type FormatVersion = {
    code: string;
    detailedFormatVersion: string;
  };

  export let formatVersions: FormatVersion[] = [];
  export let ebds: Record<string, EbdNameExtended[]> = {};
  export let currentFormatVersion = "";
  export let currentEbd = "";

  $: currentEbds = ebds[currentFormatVersion] || [];
  $: selectedEbdCode = selectMatchingEbd(currentEbd, currentEbds);

  function selectMatchingEbd(
    currentEbd: string,
    availableEbds: EbdNameExtended[],
  ): string {
    if (!currentEbd || !availableEbds.length) return "";
    const matchingEbd = availableEbds.find(
      (ebd) => ebd.ebd_code === currentEbd,
    );
    return matchingEbd ? matchingEbd.ebd_code : "";
  }

  // new format version <select> only causes ebd <select> to reset to placeholder
  function handleFormatVersionSelect(event: CustomEvent<string>) {
    const newFormatVersion = event.detail;
    if (newFormatVersion !== currentFormatVersion) {
      currentFormatVersion = newFormatVersion;
      currentEbd = ""; // Just reset the EBD selection
    }
  }

  // ebd <select> is required for redirect and URL update
  // [...ebd] exists only as a combination of /ebd/<formatversion>/<ebd>/
  function handleEbdSelect(event: CustomEvent<string>) {
    const newEbd = event.detail;
    if (newEbd !== currentEbd) {
      currentEbd = newEbd;
      if (currentFormatVersion && newEbd) {
        goto(`${base}/ebd/${currentFormatVersion}/${newEbd}`);
      }
    }
  }
</script>

<header class="bg-secondary">
  <nav
    class="mx-auto my-1 flex items-center justify-between px-6 py-4"
    aria-label="Global"
  >
    <div class="flex items-center w-4/5">
      <a href="{base}/" title="landingpage" class="flex-none items-center mr-4">
        <IconLogo />
      </a>
      <span class="text-xl text-white">EBD.HOCHFREQUENZ.DE</span>
      <div class="-mt-12 pl-10 w-1/5">
        <FormatVersionSelect
          {formatVersions}
          selectedVersion={currentFormatVersion}
          on:select={handleFormatVersionSelect}
        />
      </div>
      <div class="-mt-2 pl-5 w-1/3">
        <EbdSelect
          ebds={currentEbds}
          {selectedEbdCode}
          disabled={!currentFormatVersion}
          on:select={handleEbdSelect}
        />
      </div>
    </div>
    <div class="ml-auto">
      <ExportButton {currentFormatVersion} currentEbd={selectedEbdCode} />
    </div>
  </nav>
</header>
