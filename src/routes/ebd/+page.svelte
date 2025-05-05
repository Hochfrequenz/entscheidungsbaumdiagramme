<script lang="ts">
  import { onMount } from "svelte";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import {
    AuthButton,
    ErrorMsg,
    ExportPumlButton,
    ExportSvgButton,
    Header,
    SvgContainer,
  } from "$lib/components";
  import type { EbdNameExtended } from "$lib/types/metadata";
  import { extractSectionHeading } from "$lib/types/metadata";

  import type { PageData } from "./$types";

  export let data: PageData;

  let selectedFormatVersion: string = data.initialState.formatVersion;
  let selectedEbd: string = data.initialState.ebd;
  let selectedRoles: string[] = data.initialState.roles || [];
  let selectedChapters: string[] = data.initialState.chapters || [];
  let ebdList: EbdNameExtended[] = filterEbds(
    selectedFormatVersion,
    selectedRoles,
    selectedChapters,
  );

  let svgContent = "";
  let isLoading = false;
  let error: string | null = null;

  // missing EBDs of FV2504 (required to exclude them from SVG fetching attempts)
  const specialEbds = [
    "E_0026",
    "E_0042",
    "E_0043",
    "E_0055",
    "E_0058",
    "E_0060",
    "E_0061",
    "E_0077",
    "E_0084",
    "E_0210",
    "E_0218",
    "E_0256",
    "E_0259",
    "E_0264",
    "E_0266",
    "E_0406",
    "E_0407",
    "E_0408",
    "E_0409",
    "E_0410",
    "E_0412",
    "E_0415",
    "E_0452",
    "E_0515",
    "E_0517",
    "E_0519",
    "E_0521",
    "E_0524",
    "E_0531",
    "E_0552",
    "E_0553",
    "E_0554",
    "E_0566",
    "E_0568",
    "E_0572",
    "E_0574",
    "E_0578",
    "E_0583",
    "E_0594",
    "E_0595",
    "E_0607",
    "E_0608",
    "E_0610",
    "E_0611",
    "E_0612",
    "E_0614",
    "E_0622",
    "E_0639",
    "E_0802",
  ];

  $: if (selectedFormatVersion) {
    ebdList = filterEbds(
      selectedFormatVersion,
      selectedRoles,
      selectedChapters,
    );
  }

  function updateURL() {
    const params = new URLSearchParams();

    if (selectedFormatVersion) {
      params.set("formatversion", selectedFormatVersion);
    }
    if (selectedRoles.length > 0) {
      params.set("rolle", selectedRoles.join(","));
    }
    if (selectedChapters.length > 0) {
      params.set("chapter", selectedChapters.join(","));
    }
    if (selectedEbd) {
      params.set("ebd", selectedEbd);
    }

    const url = `${base}/ebd/?${params.toString()}`;
    goto(url, { replaceState: true, keepFocus: true });
  }

  onMount(async () => {
    const searchParams = new URLSearchParams(window.location.search);

    const formatVersion = searchParams.get("formatversion");
    const ebd = searchParams.get("ebd");
    const rolesParam = searchParams.get("rolle");
    const chaptersParam = searchParams.get("chapter");

    if (formatVersion) selectedFormatVersion = formatVersion;
    if (ebd) selectedEbd = ebd;
    if (rolesParam) {
      selectedRoles = rolesParam.split(",");
    }
    if (chaptersParam) {
      selectedChapters = chaptersParam.split(",");
    }

    if (selectedFormatVersion) {
      ebdList = filterEbds(
        selectedFormatVersion,
        selectedRoles,
        selectedChapters,
      );
    }

    if (selectedFormatVersion && selectedEbd) {
      await loadSvg();
    }
  });

  async function loadSvg() {
    if (!selectedFormatVersion || !selectedEbd) {
      svgContent = "";
      return;
    }

    // Check if this is one of our special EBDs that don't have actual SVG files
    if (
      selectedFormatVersion === "FV2504" &&
      specialEbds.includes(selectedEbd)
    ) {
      svgContent = "";
      error = "Dieses EBD hat kein verfügbares Diagramm.";
      isLoading = false;
      return;
    }

    isLoading = true;
    error = null;
    const ebdPath = `${base}/ebd/${selectedFormatVersion}/${selectedEbd}.svg`;

    try {
      const response = await fetch(ebdPath);
      if (!response.ok) {
        error = "EBD konnte nicht gefunden.";
        return;
      }
      svgContent = await response.text();
    } catch {
      error = "EBD konnte nicht gefunden.";
      svgContent = "";
    } finally {
      isLoading = false;
    }
  }

  function handleFormatVersionSelect(version: string) {
    selectedFormatVersion = version;
    selectedRoles = [];
    selectedChapters = [];
    selectedEbd = "";
    svgContent = "";
    ebdList = version ? filterEbds(version, [], []) : [];
    updateURL();
  }

  function handleEbdInput(ebdCode: string) {
    selectedEbd = ebdCode;
    loadSvg();
    updateURL();
  }

  function handleRoleSelect(roles: string[]) {
    selectedRoles = roles;
    ebdList = selectedFormatVersion
      ? filterEbds(selectedFormatVersion, roles, selectedChapters)
      : [];
    updateURL();
  }

  function handleChapterSelect(chapters: string[]) {
    selectedChapters = chapters;
    ebdList = selectedFormatVersion
      ? filterEbds(selectedFormatVersion, selectedRoles, chapters)
      : [];
    updateURL();
  }

  function handleSectionSelect(ebdCode: string) {
    if (!ebdCode) {
      // reset list of selectable EBD options of ebd-input as soon as filter is cleared
      ebdList = filterEbds(
        selectedFormatVersion,
        selectedRoles,
        selectedChapters,
      );
    } else {
      const formatVersionMetadata = data.metadata[selectedFormatVersion] || {};
      const section = formatVersionMetadata[ebdCode]?.metadata.section;
      if (section) {
        const sectionHeading = extractSectionHeading(section);
        if (sectionHeading) {
          ebdList = filterEbds(
            selectedFormatVersion,
            selectedRoles,
            selectedChapters,
            sectionHeading,
          );
        }
      }
    }
    updateURL();
  }

  function filterEbds(
    formatVersion: string,
    roles: string[],
    chapters: string[],
    section?: string,
  ): EbdNameExtended[] {
    const formatVersionMetadata = data.metadata[formatVersion] || {};
    const allEbds = data.ebds[formatVersion] || [];

    if (!roles.length && !chapters.length && !section) return allEbds;

    return allEbds.filter((ebd) => {
      const ebdMetadata = formatVersionMetadata[ebd.ebd_code];
      if (!ebdMetadata) return false;

      const matchesRole =
        !roles.length ||
        (ebdMetadata.metadata.role &&
          roles.includes(ebdMetadata.metadata.role));
      const matchesChapter =
        !chapters.length ||
        (ebdMetadata.metadata.chapter &&
          chapters.includes(ebdMetadata.metadata.chapter));
      const matchesSection =
        !section ||
        (ebdMetadata.metadata.section &&
          extractSectionHeading(ebdMetadata.metadata.section) === section);

      return matchesRole && matchesChapter && matchesSection;
    });
  }

  let isFilterPanelOpen = false;

  function handlePanelToggle(event: CustomEvent<{ isOpen: boolean }>) {
    isFilterPanelOpen = event.detail.isOpen;
  }
</script>

<div class="flex flex-col h-full overflow-hidden">
  <Header
    formatVersions={data.formatVersions}
    {selectedFormatVersion}
    onFormatVersionSelect={handleFormatVersionSelect}
    {ebdList}
    {selectedEbd}
    onEbdSelect={handleEbdInput}
    roles={data.roles}
    {selectedRoles}
    onRoleSelect={handleRoleSelect}
    chapters={data.chapters}
    {selectedChapters}
    onChapterSelect={handleChapterSelect}
    metadata={data.metadata}
    onSectionSelect={handleSectionSelect}
    on:panelToggle={handlePanelToggle}
  >
    <svelte:fragment slot="actions">
      <div class="flex gap-4">
        <ExportSvgButton
          currentFormatVersion={selectedFormatVersion}
          currentEbd={selectedEbd}
          isDisabled={!selectedFormatVersion ||
            !selectedEbd ||
            !svgContent ||
            (selectedFormatVersion === "FV2504" &&
              specialEbds.includes(selectedEbd))}
        />
        <ExportPumlButton
          currentFormatVersion={selectedFormatVersion}
          currentEbd={selectedEbd}
          isDisabled={!selectedFormatVersion ||
            !selectedEbd ||
            !svgContent ||
            (selectedFormatVersion === "FV2504" &&
              specialEbds.includes(selectedEbd))}
        />
        <AuthButton />
      </div>
    </svelte:fragment>
  </Header>

  {#if isFilterPanelOpen}
    <div class="w-full py-12 bg-secondary relative z-10"></div>
  {/if}

  <div class="flex-1 overflow-hidden bg-secondary">
    {#if error}
      <ErrorMsg />
    {:else}
      <SvgContainer {svgContent} {isLoading} {error} />
    {/if}
  </div>
</div>
