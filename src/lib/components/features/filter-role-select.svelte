<script lang="ts">
  export let disabled: boolean = false;
  export let formatVersion: string = "";
  export let roles: Record<string, string[]> = {};
  export let onSelect: (selectedRoles: string[]) => void;

  let selectedRoles: Set<string> = new Set();
  let selectElement: HTMLSelectElement;

  $: availableRoles = formatVersion ? roles[formatVersion] || [] : [];

  $: if (formatVersion) {
    selectedRoles = new Set();
    onSelect([]);
  }

  function handleSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const role = select.value;
    if (role && !selectedRoles.has(role)) {
      selectedRoles.add(role);
      selectedRoles = selectedRoles;
      onSelect([...selectedRoles]);
    }
    select.value = "";
  }

  function removeRole(role: string) {
    selectedRoles.delete(role);
    selectedRoles = selectedRoles;
    onSelect([...selectedRoles]);
  }

  function removePlaceholderChip() {
    selectedRoles = new Set();
    onSelect([]);
  }
</script>

<div class="flex flex-col items-start mt-2 w-full relative">
  <div class="w-full">
    <label
      for="role-select"
      class="absolute top-0.5 left-3 -translate-y-1/2 text-xs text-slate-500 bg-white px-1 rounded z-10"
    >
      Filter: prüfende Rollen
    </label>

    <div
      class="border-2 border-white rounded-lg bg-secondary p-3 flex flex-wrap items-center gap-2"
    >
      {#if selectedRoles.size === 0}
        <button
          type="button"
          class="inline-flex items-center border-2 border-tint rounded-full px-3 py-1 text-sm text-black disabled:opacity-25"
          on:click={removePlaceholderChip}
          {disabled}
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
        {#each [...selectedRoles] as role}
          <button
            type="button"
            class="inline-flex items-center border-2 border-tint rounded-full px-3 py-1 text-sm text-black"
            on:click={() => removeRole(role)}
            {disabled}
          >
            {role}
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
        id="role-select"
        bind:this={selectElement}
        on:change={handleSelect}
        {disabled}
        class="flex-1 min-w-[120px] bg-transparent text-black disabled:text-black/25 cursor-pointer disabled:cursor-not-allowed appearance-none focus:outline-none"
      >
        <option value="" class="bg-secondary"></option>
        {#each availableRoles as role}
          {#if !selectedRoles.has(role)}
            <option value={role} class="bg-secondary">{role}</option>
          {/if}
        {/each}
      </select>
    </div>
  </div>
</div>
