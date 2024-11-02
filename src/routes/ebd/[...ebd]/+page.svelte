<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import { onMount } from "svelte";

  import { base } from "$app/paths";
  import { page } from "$app/stores";

  let svgContainer: HTMLDivElement;
  let svgContent = "";
  let isLoading = true;
  let error: string | null = null;
  let mounted = false;

  $: params = $page.params.ebd?.split("/") || [];
  $: formatVersion = params[0];
  $: ebdKey = params[1];

  async function loadSvg() {
    if (!mounted || !formatVersion || !ebdKey) return;

    isLoading = true;
    error = null;
    const ebdPath = `${base}/ebd/${formatVersion}/${ebdKey}.svg`;

    try {
      const response = await fetch(ebdPath);
      if (!response.ok) {
        throw new Error(`http error: ${response.status}`);
      }
      svgContent = await response.text();
    } catch (err) {
      console.error(`error loading svg: ${err}`);
      svgContent = "";
    } finally {
      isLoading = false;
    }
  }

  function updateSvgSize() {
    const svg = svgContainer?.querySelector("svg");
    if (svg) {
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.style.display = "block";
    }
  }

  $: if (mounted && formatVersion && ebdKey) {
    loadSvg();
  }

  $: if (svgContent) {
    setTimeout(updateSvgSize, 0);
  }

  onMount(() => {
    mounted = true;
    if (formatVersion && ebdKey) {
      loadSvg();
    }
  });
</script>

{#if isLoading}
  <div class="flex items-center justify-center h-full">
    <p>Loading SVG...</p>
  </div>
{:else if error}
  <div class="flex items-center justify-center h-full">
    <p>{error}</p>
  </div>
{:else}
  <div
    class="max-w-[95vw] mx-auto h-full flex items-center justify-center"
    bind:this={svgContainer}
  >
    {@html svgContent}
  </div>
{/if}

<style>
  div :global(svg) {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
</style>
