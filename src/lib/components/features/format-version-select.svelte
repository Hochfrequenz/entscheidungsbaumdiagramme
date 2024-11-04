<script lang="ts">
  import { createEventDispatcher } from "svelte";

  type FormatVersion = {
    code: string;
    detailedFormatVersion: string;
  };

  export let formatVersions: FormatVersion[] = [];
  export let selectedVersion: string = "";

  const dispatch = createEventDispatcher();

  function handleSelect() {
    dispatch("select", selectedVersion);
  }
</script>

<div class="flex flex-col items-start mt-2 w-full">
  <select
    id="format-version-select"
    bind:value={selectedVersion}
    on:change={handleSelect}
    class="inline-block border-2 border-white rounded-lg bg-secondary py-3 ps-2 pe-4 focus:outline-0 w-full cursor-pointer"
  >
    <option value="">Bitte auswählen</option>
    {#each formatVersions as version}
      <option value={version.code}>{version.detailedFormatVersion}</option>
    {/each}
  </select>
  <label
    for="format-version-select"
    class="ml-3 -mt-14 text-xs border-white rounded inline-block text-slate-500 text-[12px] bg-white px-1"
  >
    Formatversion
  </label>
</div>
