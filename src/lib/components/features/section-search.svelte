<script lang="ts">
  import type { MetaData } from "$lib/types/metadata";

  export let metadata: Record<string, Record<string, MetaData>> = {};
  export let formatVersion: string = "";
  export let disabled: boolean = false;
  export let onSelect: (ebdCode: string) => void;

  type SectionEntry = {
    ebdCode: string;
    sectionText: string;
  };

  let inputValue: string = "";
  let sections: SectionEntry[] = [];
  let filteredSections: SectionEntry[] = [];
  let showOptions: boolean = false;
  let isFocused: boolean = false;
  export let selectedEbdCode: string = "";

  // remove "<section_number> AD: " pattern
  function extractSectionText(section: string): string {
    const match = section.match(/AD:\s*(.*)/);
    return match ? match[1] : section;
  }

  $: if (formatVersion) {
    const formatVersionMetadata = metadata[formatVersion] || {};
    sections = Object.entries(formatVersionMetadata)
      .filter((entry) => entry[1].metadata.section)
      .map(([ebdCode, data]) => ({
        ebdCode,
        sectionText: extractSectionText(data.metadata.section),
      }));
    filteredSections = sections;
    inputValue = "";
  } else {
    sections = [];
    filteredSections = [];
    inputValue = "";
  }

  $: if (selectedEbdCode) {
    const currentSection = sections.find((s) => s.ebdCode === selectedEbdCode);
    if (currentSection) {
      inputValue = currentSection.sectionText;
    } else {
      inputValue = "";
    }
  }

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    inputValue = input.value;
    filteredSections = sections.filter((section) =>
      section.sectionText.toLowerCase().includes(inputValue.toLowerCase()),
    );
    showOptions = true;
  }

  function handleSelect(section: SectionEntry) {
    inputValue = section.sectionText;
    showOptions = false;
    onSelect(section.ebdCode);
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
      if (!selectedEbdCode) {
        inputValue = "";
      }
    }, 200);
  }
</script>

<div class="flex flex-col items-start mt-2 w-full relative">
  <input
    type="text"
    id="section-search"
    {disabled}
    bind:value={inputValue}
    on:input={handleInput}
    on:focus={handleFocus}
    on:blur={handleBlur}
    placeholder={isFocused ? "" : 'z.B. "Lieferbeginn"'}
    class="inline-block border-2 border-white rounded-lg bg-primary py-3 px-2 ps-3 pe-4 focus:outline-none w-full placeholder-black disabled:placeholder-opacity-25 text-base leading-relaxed appearance-none cursor-pointer"
  />

  <label
    for="section-search"
    class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded"
  >
    Kapitel-Auswahl
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
          {section.sectionText}
        </button>
      {/each}
    </div>
  {/if}
</div>
