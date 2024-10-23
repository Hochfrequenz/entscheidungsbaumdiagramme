<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { EbdSelect, FormatVersionSelect, Header } from "$lib";

  import type { PageData } from "./$types";

  export let data: PageData;

  let selectedFormatVersion = "";
  let selectedEbd = "";
  let ebdList: string[] = [];

  function handleFormatVersionSelect(event: CustomEvent<string>) {
    selectedFormatVersion = event.detail;
    ebdList = selectedFormatVersion
      ? data.ebds[selectedFormatVersion] || []
      : [];
  }

  function handleEbdSelect(event: CustomEvent<string>) {
    selectedEbd = event.detail;
    if (selectedFormatVersion && selectedEbd) {
      const formattedEbd = selectedEbd.replace("_", "");
      goto(`${base}/ebd/${selectedFormatVersion}/${formattedEbd}`);
    }
  }
</script>

<Header />
<div
  class="container mx-auto flex flex-1 max-w-6xl justify-between items-center"
>
  <div class="w-3/5">
    <h2 class="border-b border-secondary inline-block pb-[12px] uppercase">
      Entscheidungsbaumdiagramme - aber es sind actually Diagramme.
    </h2>
  </div>

  <div class="w-2/5 flex flex-col">
    <div class="mb-4 pb-8">
      <FormatVersionSelect
        formatVersions={data.formatVersions}
        selectedVersion={selectedFormatVersion}
        on:select={handleFormatVersionSelect}
      />
    </div>
    <div class="mt-4">
      <EbdSelect
        ebds={ebdList}
        disabled={!selectedFormatVersion}
        on:select={handleEbdSelect}
      />
    </div>
  </div>
</div>
