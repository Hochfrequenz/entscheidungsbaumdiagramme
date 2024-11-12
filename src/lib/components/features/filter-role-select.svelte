<script lang="ts">
  export let disabled: boolean = false;
</script>

<div class="flex flex-col items-start mt-2 w-full relative">
  <select
    {disabled}
    class="inline-block border-2 border-white rounded-lg bg-secondary py-3 px-2 ps-3 pe-4 focus:outline-0 placeholder:black disabled:placeholder-opacity-25 w-full cursor-pointer text-base leading-relaxed appearance-none"
  >
    <option value="">(Optional)</option>
  </select>
  <label
    for="format-version-select"
    class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded"
  >
    Filter: Rolle
  </label>
</div>
