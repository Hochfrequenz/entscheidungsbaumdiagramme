<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { EbdSelect, ExportButton, FormatVersionSelect, IconLogo } from "$lib";

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
    const formattedCurrentEbd = currentEbd.replace(/[_-]/g, "").toLowerCase();
    return (
      availableEbds.find(
        (ebd) => ebd.replace(/[_-]/g, "").toLowerCase() === formattedCurrentEbd,
      ) || ""
    );
  }

  function handleFormatVersionSelect(event: CustomEvent<string>) {
    const newFormatVersion = event.detail;
    if (newFormatVersion !== currentFormatVersion) {
      currentFormatVersion = newFormatVersion;
      currentEbd = "";
    }
  }

  function handleEbdSelect(event: CustomEvent<string>) {
    const newEbd = event.detail;
    if (newEbd !== currentEbd) {
      currentEbd = newEbd;
      updateUrl(currentFormatVersion, newEbd);
    }
  }

  function updateUrl(formatVersion: string, ebd: string) {
    const formattedEbd = ebd.replace(/_/g, "");
    if (formatVersion && ebd) {
      goto(`${base}/ebd/${formatVersion}/${formattedEbd}`);
    } else if (formatVersion) {
      goto(`${base}/ebd/${formatVersion}`);
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
          on:select={handleEbdSelect}
        />
      </div>
    </div>
    <div class="ml-auto">
      <ExportButton {currentFormatVersion} {currentEbd} />
    </div>
  </nav>
</header>
