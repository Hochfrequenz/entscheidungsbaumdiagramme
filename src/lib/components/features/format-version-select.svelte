<script lang="ts">
  type FormatVersion = {
    code: string;
    detailedFormatVersion: string;
  };

  export let formatVersions: FormatVersion[] = [];
  export let selectedVersion: string = "";
  export let onSelect: (version: string) => void;

  import { onMount } from "svelte";

  // set default format version to FV2410 if currentDate < 06.06.2025
  function getDefaultFormatVersion(): string {
    const currentDate = new Date();
    const cutoffDate = new Date(2025, 10, 1);

    if (currentDate < cutoffDate) {
      const fv2504 = formatVersions.find((v) => v.code === "FV2504");
      return fv2504?.code || "";
    } else {
      const fv2510 = formatVersions.find((v) => v.code === "FV2510");
      return fv2510?.code || "";
    }
  }

  onMount(() => {
    if (!selectedVersion && formatVersions.length > 0) {
      selectedVersion = getDefaultFormatVersion();
      onSelect(selectedVersion);
    }
  });

  function handleSelect() {
    onSelect(selectedVersion);
  }
</script>

<div class="flex flex-col items-start mt-2 w-full relative">
  <select
    id="format-version-select"
    bind:value={selectedVersion}
    on:change={handleSelect}
    class="inline-block border-2 border-white rounded-lg bg-secondary h-[50px] px-2 ps-3 pe-4 focus:outline-none w-full cursor-pointer text-base leading-relaxed"
  >
    {#each formatVersions as version}
      <option value={version.code}>{version.detailedFormatVersion}</option>
    {/each}
  </select>
  <label
    for="format-version-select"
    class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded"
  >
    Formatversion
  </label>
</div>
