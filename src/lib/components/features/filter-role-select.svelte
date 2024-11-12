<script lang="ts">
  export let disabled: boolean = false;
  export let formatVersion: string = "";
  export let roles: Record<string, string[]> = {};
  export let onSelect: (role: string) => void;

  let selectedRole = "";

  $: availableRoles = formatVersion ? roles[formatVersion] || [] : [];

  // reset role filter select upon changing format version
  $: if (formatVersion) {
    selectedRole = "";
  }

  function handleSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    selectedRole = select.value;
    onSelect(select.value);
  }
</script>

<div class="flex flex-col items-start mt-2 w-full relative">
  <select
    id="role-select"
    bind:value={selectedRole}
    {disabled}
    on:change={handleSelect}
    class="inline-block border-2 border-white rounded-lg bg-secondary py-3 px-2 ps-3 pe-4 focus:outline-0 w-full cursor-pointer text-base leading-relaxed appearance-none text-black disabled:text-black/25"
  >
    <option value="" class={disabled ? "text-black/25" : "text-black"}>
      (Optional)
    </option>
    {#each availableRoles as role}
      <option value={role}>{role}</option>
    {/each}
  </select>
  <label
    for="role-select"
    class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded"
  >
    Filter: Rolle
  </label>
</div>
