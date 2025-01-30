<script lang="ts">
  import { base } from "$app/paths";
  import {
    EbdInput,
    EbdNavigation,
    FilterChapterSelect,
    FilterRoleSelect,
    FilterSectionInput,
    FormatVersionSelect,
    IconLogo,
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
      class="flex items-center px-6 py-2 border-b border-white/10"
      aria-label="Global"
    >
      <div class="flex items-center gap-4">
        <div class="flex-none">
          <a href="{base}/" title="landingpage">
            <IconLogo size={23} />
          </a>
        </div>
        <span class="text-xl text-black/70 whitespace-nowrap">
          Entscheidungsbaumdiagramme
        </span>
        <div class="min-w-[150px] flex items-center pl-1 pb-1">
          <FormatVersionSelect
            {formatVersions}
            selectedVersion={selectedFormatVersion}
            onSelect={onFormatVersionSelect}
          />
        </div>
        <div class="flex items-center gap-1 pb-1">
          <div class="min-w-[150px] flex items-center">
            <EbdInput
              ebds={ebdList}
              disabled={!selectedFormatVersion}
              selectedEbdCode={selectedEbd}
              formatVersionChanged={false}
              onSelect={onEbdSelect}
            />
          </div>
          <div class="flex items-center pt-2">
            <EbdNavigation
              currentEbds={ebdList}
              selectedEbdCode={selectedEbd}
              currentFormatVersion={selectedFormatVersion}
              onSelect={onEbdSelect}
              isDisabled={!selectedFormatVersion || !selectedEbd}
            />
          </div>
        </div>
      </div>

      <div class="flex-1"></div>

      <div class="flex items-center gap-4">
        <div class="min-w-[150px]">
          <FilterRoleSelect
            isDisabled={!selectedFormatVersion}
            formatVersion={selectedFormatVersion}
            {roles}
            onSelect={onRoleSelect}
            initialRoles={selectedRoles}
          />
        </div>
        <div class="min-w-[150px]">
          <FilterChapterSelect
            isDisabled={!selectedFormatVersion}
            formatVersion={selectedFormatVersion}
            chapter={chapters}
            onSelect={onChapterSelect}
            initialChapters={selectedChapters}
          />
        </div>
        <div class="min-w-[150px]">
          <FilterSectionInput
            {metadata}
            formatVersion={selectedFormatVersion}
            disabled={!selectedFormatVersion}
            onSelect={onSectionSelect}
          />
        </div>
        <div class="ml-4 flex items-center">
          <slot name="actions" />
        </div>
      </div>
    </nav>
  </div>
</header>
