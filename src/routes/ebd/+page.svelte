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
          isDisabled={!selectedFormatVersion || !selectedEbd || !svgContent}
        />
        <ExportPumlButton
          currentFormatVersion={selectedFormatVersion}
          currentEbd={selectedEbd}
          isDisabled={!selectedFormatVersion || !selectedEbd || !svgContent}
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
