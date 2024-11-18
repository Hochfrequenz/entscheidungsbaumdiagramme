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
  let selectedRoles: string[] = [];
  let ebdList: EbdNameExtended[] = [];

  $: if (selectedFormatVersion && selectedRoles !== undefined) {
    ebdList = filterEbdsByRole(selectedFormatVersion, selectedRoles);
  }

  function handleFormatVersionSelect(version: string) {
    selectedFormatVersion = version;
    selectedRoles = [];
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

  function handleRoleSelect(roles: string[]) {
    selectedRoles = roles;
    ebdList = selectedFormatVersion
      ? filterEbdsByRole(selectedFormatVersion, roles)
      : [];
  }

  function filterEbdsByRole(
    formatVersion: string,
    roles: string[],
  ): EbdNameExtended[] {
    if (!roles.length) return data.ebds[formatVersion] || [];

    const filteredEbds: EbdNameExtended[] = [];
    const formatVersionMetadata = data.metadata[formatVersion] || {};

    data.ebds[formatVersion]?.forEach((ebd) => {
      const ebdMetadata = formatVersionMetadata[ebd.ebd_code];
      if (
        ebdMetadata?.metadata.role &&
        roles.includes(ebdMetadata.metadata.role)
      ) {
        filteredEbds.push(ebd);
      }
    });

    return filteredEbds;
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
        isDisabled={!selectedFormatVersion}
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
