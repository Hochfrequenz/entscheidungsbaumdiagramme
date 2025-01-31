<script lang="ts">
  import type { MetaData } from "$lib/types/metadata";
  import { extractSectionHeading } from "$lib/types/metadata";

  export let metadata: Record<string, Record<string, MetaData>> = {};
  export let formatVersion: string = "";
  export let disabled: boolean = false;
  export let onSelect: (ebdCode: string) => void;

  type SectionEntry = {
    ebdCodes: string[]; // e.g. ["E_001", "E_003"]
    sectionHeading: string; // e.g. "GPKE"
  };

  let inputValue: string = "";
  let sections: SectionEntry[] = [];
  let filteredSections: SectionEntry[] = [];
  let showOptions: boolean = false;
  let isFocused: boolean = false;

  $: if (formatVersion) {
    const formatVersionMetadata = metadata[formatVersion] || {};
    const sectionMap = new Map<string, string[]>();

    Object.entries(formatVersionMetadata).forEach(([ebdCode, data]) => {
      if (data.metadata.section) {
        const sectionHeading = extractSectionHeading(data.metadata.section);
        if (!sectionMap.has(sectionHeading)) {
          sectionMap.set(sectionHeading, []);
        }
        sectionMap.get(sectionHeading)!.push(ebdCode);
      }
    });

    sections = Array.from(sectionMap.entries())
      .map(([sectionHeading, ebdCodes]) => ({
        sectionHeading,
        ebdCodes,
      }))
      .sort((a, b) => a.sectionHeading.localeCompare(b.sectionHeading));

    filteredSections = sections;
    inputValue = "";
  } else {
    sections = [];
    filteredSections = [];
    inputValue = "";
  }

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    inputValue = input.value;
    filteredSections = sections.filter((section) =>
      section.sectionHeading.toLowerCase().includes(inputValue.toLowerCase()),
    );
    showOptions = true;
  }

  function handleSelect(section: SectionEntry) {
    inputValue = section.sectionHeading;
    showOptions = false;
    onSelect(section.ebdCodes[0]);
  }

  function handleFocus() {
    isFocused = true;
    showOptions = true;
    inputValue = "";
    filteredSections = sections;
  }

  function handleBlur() {
    isFocused = false;
    setTimeout(() => {
      showOptions = false;
    }, 200);
  }

  function clearInput(event: MouseEvent) {
    event.preventDefault();
    inputValue = "";
    showOptions = false;
    filteredSections = sections;
    onSelect("");
  }
</script>

<!-- py-[9.5px] is required to match py-3 of <select> since the browser renders <input> and <select> slightly differently -->
<div class="flex flex-col items-start mt-2 w-full relative">
  <div class="relative w-full">
    <input
      type="text"
      id="section-search"
      {disabled}
      bind:value={inputValue}
      on:input={handleInput}
      on:focus={handleFocus}
      on:blur={handleBlur}
      placeholder={isFocused ? "" : 'z.B. "Lieferbeginn"'}
      class="inline-block border-2 border-white rounded-lg bg-primary py-[9.5px] px-2 ps-3 pe-10 focus:outline-none w-full placeholder-white disabled:placeholder-opacity-25 text-base leading-relaxed cursor-pointer"
    />
    {#if inputValue && !disabled}
      <button
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2"
        on:mousedown|preventDefault={clearInput}
        aria-label="Prozessfilter zurücksetzen"
      >
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    {/if}
  </div>

  <label
    for="section-search"
    class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded"
  >
    Filter: Prozess
  </label>

  {#if showOptions && !disabled}
    <div
      class="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg max-h-60 overflow-y-auto z-50 mt-1"
    >
      {#each filteredSections as section}
        <button
          on:mousedown={() => handleSelect(section)}
          class="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
        >
          {section.sectionHeading}
        </button>
      {/each}
    </div>
  {/if}
</div>
