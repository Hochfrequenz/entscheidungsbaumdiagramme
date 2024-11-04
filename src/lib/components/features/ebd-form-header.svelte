<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import {
    EbdSelect,
    ExportButton,
    FormatVersionSelect,
    IconLogo,
  } from "$lib/components";

  type FormatVersion = {
    code: string;
    detailedFormatVersion: string;
  };

  export let formatVersions: FormatVersion[] = [];
  export let ebds: Record<string, string[]> = {};
  export let currentFormatVersion = "";
  export let currentEbd = "";

  $: currentEbds = ebds[currentFormatVersion] || [];
  $: selectedEbd = selectMatchingEbd(currentEbd, currentEbds);

  function selectMatchingEbd(
    currentEbd: string,
    availableEbds: string[],
  ): string {
    if (!currentEbd || !availableEbds.length) return "";
    return availableEbds.find((ebd) => ebd === currentEbd) || "";
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
          {selectedEbd}
          disabled={!currentFormatVersion}
          on:select={handleEbdSelect}
        />
      </div>
    </div>
    <div class="ml-auto">
      <ExportButton {currentFormatVersion} currentEbd={selectedEbd} />
    </div>
  </nav>
</header>
