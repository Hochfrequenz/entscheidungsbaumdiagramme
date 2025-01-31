<script lang="ts">
  import {
    FilterChapterSelect,
    FilterRoleSelect,
    FilterSectionInput,
    IconFilterClose,
    IconFilterOpen,
  } from "$lib/components";
  import type { MetaData } from "$lib/types/metadata";

  export let isDisabled: boolean = false;
  export let formatVersion: string = "";
  export let roles: Record<string, string[]> = {};
  export let selectedRoles: string[] = [];
  export let onRoleSelect: (roles: string[]) => void;
  export let chapters: Record<string, string[]> = {};
  export let selectedChapters: string[] = [];
  export let onChapterSelect: (chapters: string[]) => void;
  export let metadata: Record<string, Record<string, MetaData>> = {};
  export let onSectionSelect: (ebdCode: string) => void;

  let isOpen = false;

  function togglePanel() {
    isOpen = !isOpen;
  }
</script>

<div class="inline-block">
  <button on:click={togglePanel} class="hover:scale-110">
    {#if isOpen}
      <IconFilterOpen />
    {:else}
      <IconFilterClose />
    {/if}
  </button>

  {#if isOpen}
    <div class="absolute left-0 mt-2 px-4 py-6">
      <div class="flex gap-4 max-w-[800px] mx-auto">
        <div class="min-w-[300px] flex-1">
          <FilterRoleSelect
            {isDisabled}
            {formatVersion}
            {roles}
            onSelect={onRoleSelect}
            initialRoles={selectedRoles}
          />
        </div>
        <div class="min-w-[300px] flex-1">
          <FilterChapterSelect
            {isDisabled}
            {formatVersion}
            chapter={chapters}
            onSelect={onChapterSelect}
            initialChapters={selectedChapters}
          />
        </div>
        <div class="min-w-[250px] flex-1">
          <FilterSectionInput
            {metadata}
            {formatVersion}
            disabled={isDisabled}
            onSelect={onSectionSelect}
          />
        </div>
      </div>
    </div>
  {/if}
</div>
