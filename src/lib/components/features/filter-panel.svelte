<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import {
    FilterChapterSelect,
    FilterRoleSelect,
    FilterSectionInput,
    IconFilter,
  } from "$lib/components";
  import type { MetaData } from "$lib/types/metadata";

  const dispatch = createEventDispatcher<{
    panelToggle: { isOpen: boolean };
  }>();

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
    dispatch("panelToggle", { isOpen });
  }
</script>

<div class="inline-block pr-4">
  <button
    on:click={togglePanel}
    class="flex flex-row justify-center items-center gap-2 rounded-full bg-secondary mt-1.5 p-3 transition-opacity duration-200 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed w-11 h-11"
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
