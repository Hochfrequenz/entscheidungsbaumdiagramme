<script lang="ts">
  import {
    FilterChapterSelect,
    FilterRoleSelect,
    FilterSectionInput,
    IconFilter,
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
  <button
    on:click={togglePanel}
    class="mt-1.5 px-4 cursor-pointer disabled:cursor-not-allowed"
    class:opacity-30={isDisabled}
    disabled={isDisabled}
  >
    <IconFilter />
  </button>

  {#if isOpen}
    <div class="absolute left-0 mt-1 px-4 py-6 z-30">
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
        <div class="min-w-[300px] flex-1">
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
