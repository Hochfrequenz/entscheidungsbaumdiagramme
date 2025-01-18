<script lang="ts">
  import {
    EbdInput,
    EbdNavigation,
    FilterChapterSelect,
    FilterRoleSelect,
    FilterSectionInput,
    FormatVersionSelect,
  } from "$lib/components";
  import type { EbdNameExtended, MetaData } from "$lib/types/metadata";

  export let formatVersions: Array<{
    code: string;
    detailedFormatVersion: string;
  }> = [];
  export let selectedFormatVersion: string = "";
  export let onFormatVersionSelect: (version: string) => void;
  export let ebdList: EbdNameExtended[] = [];
  export let selectedEbd: string = "";
  export let onEbdSelect: (ebdCode: string) => void;
  export let roles: Record<string, string[]> = {};
  export let selectedRoles: string[] = [];
  export let onRoleSelect: (roles: string[]) => void;
  export let chapters: Record<string, string[]> = {};
  export let selectedChapters: string[] = [];
  export let onChapterSelect: (chapters: string[]) => void;
  export let metadata: Record<string, Record<string, MetaData>> = {};
  export let onSectionSelect: (ebdCode: string) => void;
</script>

<header class="bg-primary">
  <div class="mx-auto">
    <nav
      class="flex items-center justify-between px-6 py-4 border-b border-white/10"
      aria-label="Global"
    >
      <div class="flex items-center w-4/5">
        <div class="-mt-2 w-1/5">
          <FormatVersionSelect
            {formatVersions}
            selectedVersion={selectedFormatVersion}
            onSelect={onFormatVersionSelect}
          />
        </div>
        <div class="-mt-2 pl-5 w-1/5">
          <FilterRoleSelect
            isDisabled={!selectedFormatVersion}
            formatVersion={selectedFormatVersion}
            {roles}
            onSelect={onRoleSelect}
            initialRoles={selectedRoles}
          />
        </div>
        <div class="-mt-2 pl-5 w-1/5">
          <FilterChapterSelect
            isDisabled={!selectedFormatVersion}
            formatVersion={selectedFormatVersion}
            chapter={chapters}
            onSelect={onChapterSelect}
            initialChapters={selectedChapters}
          />
        </div>
        <div class="-mt-2 pl-5 w-1/3 mr-1">
          <EbdInput
            ebds={ebdList}
            disabled={!selectedFormatVersion}
            selectedEbdCode={selectedEbd}
            formatVersionChanged={false}
            onSelect={onEbdSelect}
          />
        </div>
        <EbdNavigation
          currentEbds={ebdList}
          selectedEbdCode={selectedEbd}
          currentFormatVersion={selectedFormatVersion}
          onSelect={onEbdSelect}
          isDisabled={!selectedFormatVersion || !selectedEbd}
        />
      </div>
      <div class="-mt-2 w-1/4 mr-2">
        <FilterSectionInput
          {metadata}
          formatVersion={selectedFormatVersion}
          disabled={!selectedFormatVersion}
          onSelect={onSectionSelect}
        />
      </div>
      <div class="ml-auto">
        <slot name="actions" />
      </div>
    </nav>
  </div>
</header>
