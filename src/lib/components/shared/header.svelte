<script lang="ts">
  import { base } from "$app/paths";
  import {
    EbdInput,
    EbdNavigation,
    FilterPanel,
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

  let hasForatVersionSelected = selectedFormatVersion !== "";
  $: hasForatVersionSelected = selectedFormatVersion !== "";
</script>

<header class="bg-primary">
  <div class="mx-auto">
    <nav
      class="flex items-center px-6 py-2 border-b border-white/10"
      aria-label="Global"
    >
      <div class="flex items-center gap-4">
        <div class="flex pt-1">
          <a href="{base}/" title="landingpage">
            <IconLogo size={23} />
          </a>
          <span class="text-xl text-black/70 whitespace-nowrap">
            Entscheidungsbaumdiagramme
          </span>
        </div>
        <div class="min-w-[245px] flex items-center pl-1 pb-1">
          <FormatVersionSelect
            {formatVersions}
            selectedVersion={selectedFormatVersion}
            onSelect={onFormatVersionSelect}
          />
        </div>
        <div class="flex items-center gap-1 pl-[2px] pb-1">
          <div class="min-w-[298px] flex items-center">
            <EbdInput
              ebds={ebdList}
              disabled={!hasForatVersionSelected}
              selectedEbdCode={selectedEbd}
              formatVersionChanged={hasForatVersionSelected}
              onSelect={onEbdSelect}
            />
          </div>
          <div class="flex items-center gap-4 pl-1.5">
            <div class="pt-2">
              <EbdNavigation
                currentEbds={ebdList}
                selectedEbdCode={selectedEbd}
                currentFormatVersion={selectedFormatVersion}
                onSelect={onEbdSelect}
                isDisabled={!selectedFormatVersion || !selectedEbd}
              />
            </div>

            <FilterPanel
              isDisabled={!selectedFormatVersion}
              formatVersion={selectedFormatVersion}
              {roles}
              {selectedRoles}
              {onRoleSelect}
              {chapters}
              {selectedChapters}
              {onChapterSelect}
              {metadata}
              {onSectionSelect}
            />
          </div>
        </div>
      </div>

      <div class="flex-1"></div>

      <div class="flex items-center">
        <slot name="actions" />
      </div>
    </nav>
  </div>
</header>
