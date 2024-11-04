<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let ebds: string[] = [];
  export let disabled: boolean = false;
  export let selectedEbd: string = "";

  const dispatch = createEventDispatcher<{ select: string }>();

  let inputValue: string = selectedEbd; // preselected EBD on dynamic routes
  let filteredEbds: string[] = ebds; // by default (without filter), the list of filtered EBDs is equivalent to a list containing all fetched EBDs
  let showOptions: boolean = false; // used for setting the visibility state of the window containing the selectable EBDs
  let isFocused: boolean = false; // used for setting the focus state of the EBD input to show/hide the window containing the selectable EBDs

  $: {
    if (selectedEbd && !isFocused) {
      inputValue = selectedEbd;
    }
  }

  function handleInput(
    event: Event & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    const input = event.currentTarget;
    inputValue = input.value;
    filteredEbds = ebds.filter((ebd) => ebd.includes(inputValue.toUpperCase()));
    showOptions = true;
  }

  function handleSelect(ebd: string) {
    inputValue = ebd;
    selectedEbd = ebd;
    showOptions = false;
    dispatch("select", ebd);
  }

  function handleFocus() {
    isFocused = true;
    showOptions = true;
    inputValue = "";
    filteredEbds = ebds;
  }

  // closes list of selectable EBDs when removing focus
  function handleBlur() {
    isFocused = false;
    setTimeout(() => {
      showOptions = false;
      inputValue = selectedEbd;
    }, 200);
  }
</script>

<div class="flex flex-col items-start mt-2 w-full relative">
  <input
    type="text"
    id="ebd-input"
    {disabled}
    value={inputValue}
    on:input={handleInput}
    on:focus={handleFocus}
    on:blur={handleBlur}
    placeholder={isFocused ? "" : "Bitte auswählen"}
    class="inline-block border-2 border-white rounded-lg bg-secondary py-3 ps-2 pe-4 focus:outline-0 w-full"
    class:placeholder-opacity-50={disabled}
    class:placeholder-black={!disabled}
  />

  <label
    for="ebd-input"
    class="absolute top-0.5 left-3 -translate-y-1/2 text-xs border-white rounded inline-block text-slate-500 text-[12px] bg-white px-1"
  >
    EBD
  </label>

  {#if showOptions && !disabled}
    <div
      class="suggestions-list absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg max-h-60 overflow-y-auto z-50 mt-1"
    >
      {#each filteredEbds as ebd}
        <button
          on:mousedown={() => handleSelect(ebd)}
          class="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
        >
          {ebd}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  input::placeholder {
    opacity: 1;
  }
</style>
