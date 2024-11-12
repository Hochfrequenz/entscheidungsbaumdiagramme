<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import {
    EbdInput,
    FilterRoleSelect,
    FormatVersionSelect,
    Header,
  } from "$lib/components";
  import type { EbdNameExtended } from "$lib/types/metadata";

  import type { PageData } from "./$types";

  export let data: PageData;

  let selectedFormatVersion = "";
  let selectedEbd = "";
  let selectedRole = "";
  let ebdList: EbdNameExtended[] = [];

  function handleFormatVersionSelect(version: string) {
    selectedFormatVersion = version;
    selectedRole = "";
    ebdList = selectedFormatVersion
      ? data.ebds[selectedFormatVersion] || []
      : [];
  }

  function handleEbdInput(ebdCode: string) {
    selectedEbd = ebdCode;
    if (selectedFormatVersion && selectedEbd) {
      goto(`${base}/ebd/${selectedFormatVersion}/${selectedEbd}`);
    }
  }

  function handleRoleSelect(role: string) {
    selectedRole = role;
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
    <div class="mb-4">
      <FormatVersionSelect
        formatVersions={data.formatVersions}
        selectedVersion={selectedFormatVersion}
        onSelect={handleFormatVersionSelect}
      />
    </div>
    <div class="my-4">
      <FilterRoleSelect
        disabled={!selectedFormatVersion}
        formatVersion={selectedFormatVersion}
        roles={data.roles}
        onSelect={handleRoleSelect}
      />
    </div>
    <div class="mt-4">
      <EbdInput
        ebds={ebdList}
        disabled={!selectedFormatVersion}
        selectedEbdCode={selectedEbd}
        formatVersionChanged={false}
        onSelect={handleEbdInput}
      />
    </div>
  </div>
</div>
