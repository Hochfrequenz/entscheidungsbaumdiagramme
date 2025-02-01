<script lang="ts">
  import { onMount } from "svelte";

  export let isDisabled: boolean = false; // controls whether the chapter filter is disabled (depending on state of <FormatVersionSelect />)
  export let formatVersion: string = ""; // currently selected format version that determines available chapters
  export let chapter: Record<string, string[]> = {}; // maps format versions to their available chapter for EBD filtering
  export let initialChapters: string[] = []; // initialize the chapter in both the page and the component
  export let onSelect: (selectedChapters: string[]) => void;

  let selectedChapters: Set<string> = new Set(initialChapters);
  let selectElement: HTMLSelectElement;
  let isSelectFocused = false;
  let isInitialized = false;

  $: availableChapters = formatVersion ? chapter[formatVersion] || [] : [];

  // initialize selectedChapters when initialChapters changes
  $: if (!isInitialized && initialChapters.length > 0) {
    selectedChapters = new Set(initialChapters);
    isInitialized = true;
  }

  // reset chapter filter select upon changing format version
  $: if (formatVersion && isInitialized) {
    if (!selectedChapters.size) {
      selectedChapters = new Set(initialChapters);
    }
  }

  // map chapter aliases for "MeMi" and "Modell 2" due to their names being way too long and messing with the <select>
  const chapterMapping: Record<string, string> = {
    "Prozesse zur Ermittlung und Abrechnung von Mehr-/Mindermengen Strom und Gas":
      "MeMi",
    "Zum Modell 2 zur ladevorgangscharfen bilanziellen Energiemengenzuordnungsmöglichkeit":
      "Modell 2",
  };

  // get chapter alias if one exists, otherwise get original chapter name
  function getChapterName(chapterName: string): string {
    return chapterMapping[chapterName] || chapterName;
  }

  onMount(() => {
    if (initialChapters.length > 0) {
      selectedChapters = new Set(initialChapters);
      onSelect([...selectedChapters]);
    }
    isInitialized = true;
  });

  function handleSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const chapter = select.value;
    if (chapter && !selectedChapters.has(chapter)) {
      selectedChapters = new Set([...selectedChapters, chapter]);
      onSelect([...selectedChapters]);
    }
    select.value = "";
  }

  function removeChapter(chapter: string) {
    selectedChapters = new Set(
      [...selectedChapters].filter((r) => r !== chapter),
    );
    onSelect([...selectedChapters]);
  }

  // visual indicator that all chapters are selected and no EBDs are filtered (by chapter)
  function removePlaceholderChip() {
    selectedChapters = new Set();
    onSelect([]);
  }

  function handleFocus() {
    isSelectFocused = true;
  }

  function handleBlur() {
    setTimeout(() => {
      isSelectFocused = false;
    }, 200);
  }
</script>

<div class="flex flex-col items-start mt-2 w-full relative">
  <div class="w-full">
    <label
      for="chapter-select"
      class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded z-10"
    >
      Filter: Netzzugangsthema
    </label>

    <div
      class="border-2 border-white rounded-lg bg-primary p-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap"
    >
      {#if selectedChapters.size === 0 && !isSelectFocused}
        <button
          type="button"
          class="inline-flex items-center border-2 border-tint rounded-full px-3 py-1 text-sm text-white disabled:opacity-25"
          on:click={removePlaceholderChip}
          disabled={isDisabled}
        >
          alle
          <svg
            class="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      {:else}
        {#each [...selectedChapters] as chapter}
          <button
            type="button"
            class="inline-flex items-center border-2 border-tint rounded-full px-3 py-1 text-sm text-white"
            on:click={() => removeChapter(chapter)}
            disabled={isDisabled}
          >
            {getChapterName(chapter)}
            <svg
              class="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        {/each}
      {/if}

      <select
        id="chapter-select"
        bind:this={selectElement}
        on:change={handleSelect}
        on:focus={handleFocus}
        on:blur={handleBlur}
        disabled={isDisabled}
        class="flex-1 min-w-[120px] bg-transparent text-black disabled:text-black/25 cursor-pointer disabled:cursor-not-allowed appearance-none focus:outline-none"
      >
        <option value="" class="hidden"> </option>
        {#each availableChapters as chapter}
          {#if !selectedChapters.has(chapter)}
            <option value={chapter} class="bg-primary" title={chapter}
              >{getChapterName(chapter)}</option
            >
          {/if}
        {/each}
      </select>
    </div>
  </div>
</div>
