<script lang="ts">
  import type { ResultGroup } from "$lib/ebd-way";

  export let groups: ResultGroup[] = []; // result groups of the shown EBD (codes, then Ende, then note-only results)
  export let selected: string = ""; // key of the highlighted result group, "" for none
  export let isDisabled: boolean = false;
  export let onSelect: (key: string) => void;

  function handleChange(event: Event) {
    onSelect((event.target as HTMLSelectElement).value);
  }
</script>

<div class="relative">
  <label
    for="result-select"
    class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded z-10"
  >
    Ergebnis hervorheben
  </label>
  <select
    id="result-select"
    value={selected}
    on:change={handleChange}
    disabled={isDisabled || groups.length === 0}
    class="w-[190px] rounded-full bg-secondary text-[16px] py-3 px-4 text-black/70 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
  >
    <option value="">kein Ergebnis gewählt</option>
    {#each groups as group (group.key)}
      <option value={group.key} title={group.key}>{group.label}</option>
    {/each}
  </select>
</div>
