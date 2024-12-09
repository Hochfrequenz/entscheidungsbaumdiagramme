<script lang="ts">
  import { base } from "$app/paths";
  import { ExportButton, Header } from "$lib/components";
  import type { EbdNameExtended } from "$lib/types/metadata";
  import type { PageData } from "./$types";

  export let data: PageData;

  let selectedFormatVersion = "";
  let selectedEbd = "";
  let selectedRoles: string[] = [];
  let ebdList: EbdNameExtended[] = [];

  let svgContainer: HTMLDivElement;
  let svgContent = "";
  let isLoading = false;
  let error: string | null = null;

  $: if (selectedFormatVersion && selectedRoles !== undefined) {
    ebdList = filterEbdsByRole(selectedFormatVersion, selectedRoles);
  }

  async function loadSvg() {
    if (!selectedFormatVersion || !selectedEbd) {
      svgContent = "";
      return;
    }

    isLoading = true;
    error = null;
    const ebdPath = `${base}/ebd/${selectedFormatVersion}/${selectedEbd}.svg`;

    try {
      const response = await fetch(ebdPath);
      if (!response.ok) {
        throw new Error(`http error: ${response.status}`);
      }
      svgContent = await response.text();
    } catch (err) {
      console.error(`error loading svg: ${err}`);
      error = String(err);
      svgContent = "";
    } finally {
      isLoading = false;
    }
  }

  function updateSvgSize() {
    const svg = svgContainer?.querySelector("svg");
    if (svg) {
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.display = "block";
    }
  }

  function handleFormatVersionSelect(version: string) {
    selectedFormatVersion = version;
    selectedRoles = [];
    selectedEbd = "";
    svgContent = "";
    ebdList = selectedFormatVersion
      ? data.ebds[selectedFormatVersion] || []
      : [];
  }

  function handleEbdInput(ebdCode: string) {
    selectedEbd = ebdCode;
    loadSvg();
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

  $: if (svgContent) {
    setTimeout(updateSvgSize, 0);
  }
</script>

<div class="flex flex-col h-full">
  <Header
    formatVersions={data.formatVersions}
    {selectedFormatVersion}
    onFormatVersionSelect={handleFormatVersionSelect}
    {ebdList}
    selectedEbd={selectedEbd}
    onEbdSelect={handleEbdInput}
    roles={data.roles}
    onRoleSelect={handleRoleSelect}
  >
    <svelte:fragment slot="actions">
      {#if selectedFormatVersion && selectedEbd}
        <ExportButton
          currentFormatVersion={selectedFormatVersion}
          currentEbd={selectedEbd}
        />
      {/if}
    </svelte:fragment>
  </Header>

  <div class="flex-1 p-4">
    {#if isLoading}
      <div class="flex items-center justify-center h-full">
        <p>Loading SVG...</p>
      </div>
    {:else if error}
      <div class="flex items-center justify-center h-full">
        <p>{error}</p>
      </div>
    {:else if svgContent}
      <div
        class="max-w-[95vw] mx-auto h-full flex items-center justify-center"
        bind:this={svgContainer}
      >
        {@html svgContent}
      </div>
    {:else}
      <div class="flex items-center justify-center h-full text-gray-500">
        Select a format version and EBD to view the diagram
      </div>
    {/if}
  </div>
</div>

<style>
  div :global(svg) {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
</style>