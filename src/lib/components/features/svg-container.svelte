<script lang="ts">
  export let svgContent: string = "";
  export let isLoading: boolean = false;
  export let error: string | null = null;

  let svgContainer: HTMLDivElement;
  let svgWidth = 0;

  function updateSvgSize() {
    const svg = svgContainer?.querySelector("svg");
    if (svg) {
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.display = "block";

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          svgWidth = entry.contentRect.width;
        }
      });
      observer.observe(svg);
      return () => observer.disconnect();
    }
  }

  $: stripWidth = Math.max(svgWidth * 0.08, 0);
  $: stripHeight = Math.max(svgWidth * 0.03, 0);
  $: stripTop = Math.max(svgWidth * 0.035, 0); // calculate <top> positioning of strips relative to SVG height (SVG width is fixed)

  $: if (svgContent) {
    setTimeout(updateSvgSize, 0);
  }
</script>

<div class="h-full w-full flex flex-col relative">
  {#if isLoading}
    <div class="flex items-center justify-center h-full">
      <p>EBD wird geladen...</p>
    </div>
  {:else if error}
    <div class="flex items-center justify-center h-full">
      <p>{error}</p>
    </div>
  {:else if svgContent}
    <div class="flex-1 overflow-auto relative">
      <div
        class="absolute inset-0 min-h-min w-full p-20 flex items-start justify-center"
        bind:this={svgContainer}
      >
        <!-- tesa affiliate -->
        <div class="relative w-full">
          <!-- left strip -->
          <div
            class="absolute -rotate-45 bg-white opacity-50"
            style="
              width: {stripWidth}px; 
              height: {stripHeight}px; 
              top: {stripTop}px;
              left: -2%;
              transform-origin: top left;"
          ></div>
          <!-- right strip -->
          <div
            class="absolute rotate-45 bg-white opacity-50"
            style="
              width: {stripWidth}px; 
              height: {stripHeight}px; 
              top: {stripTop}px;
              right: -2%;
              transform-origin: top right;"
          ></div>
          {@html svgContent}
        </div>
      </div>
    </div>
  {/if}
</div>
