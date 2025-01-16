<script lang="ts">
  export let svgContent: string = "";
  export let isLoading: boolean = false;
  export let error: string | null = null;

  let svgContainer: HTMLDivElement;

  function updateSvgSize() {
    const svg = svgContainer?.querySelector("svg");
    if (svg) {
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.display = "block";
    }
  }

  $: if (svgContent) {
    setTimeout(updateSvgSize, 0);
  }
</script>

<div class="h-full w-full flex flex-col">
  {#if isLoading}
    <div class="flex items-center justify-center h-full">
      <p>Loading SVG...</p>
    </div>
  {:else if error}
    <div class="flex items-center justify-center h-full">
      <p>{error}</p>
    </div>
  {:else if svgContent}
    <div class="flex-1 overflow-auto relative" style="contain: size layout;">
      <div
        class="absolute inset-0 min-h-min w-full p-4 flex items-start justify-center"
        bind:this={svgContainer}
      >
        {@html svgContent}
      </div>
    </div>
  {/if}
</div>

<style>
  div :global(svg) {
    max-width: 100%;
    height: auto;
  }
</style>
