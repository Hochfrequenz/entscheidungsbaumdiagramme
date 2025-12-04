<script lang="ts">
  import { onMount } from "svelte";

  export let svgContent: string = "";
  export let isLoading: boolean = false;
  export let error: string | null = null;

  let svgContainer: HTMLDivElement;
  let svgWrapper: HTMLDivElement;
  let svgWidth = 0;

  const DEFAULT_SCALE = 1;
  const MIN_SCALE = 0.25;
  const MAX_SCALE = 5;
  const ZOOM_STEP = 0.15;
  const LEFT_MOUSE_BUTTON = 0;

  let scale = DEFAULT_SCALE;
  let translateX = 0;
  let translateY = 0;

  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let startTranslateX = 0;
  let startTranslateY = 0;
  let updateSizeTimeout: ReturnType<typeof setTimeout> | undefined;

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

  function handleWheel(event: WheelEvent) {
    if (!event.ctrlKey && !event.metaKey) return;

    event.preventDefault();

    const rect = svgWrapper.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const isScrollingDown = event.deltaY > 0;
    const delta = isScrollingDown ? -ZOOM_STEP : ZOOM_STEP;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta));

    if (newScale !== scale) {
      const scaleRatio = newScale / scale;
      translateX = mouseX - (mouseX - translateX) * scaleRatio;
      translateY = mouseY - (mouseY - translateY) * scaleRatio;
      scale = newScale;
    }
  }

  function handleMouseDown(event: MouseEvent) {
    if (event.button !== LEFT_MOUSE_BUTTON) return;
    isPanning = true;
    startX = event.clientX;
    startY = event.clientY;
    startTranslateX = translateX;
    startTranslateY = translateY;
    svgWrapper.style.cursor = "grabbing";
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isPanning) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    translateX = startTranslateX + dx;
    translateY = startTranslateY + dy;
  }

  function handleMouseUp() {
    isPanning = false;
    if (svgWrapper) {
      svgWrapper.style.cursor = "grab";
    }
  }

  function zoomIn() {
    const newScale = Math.min(MAX_SCALE, scale + ZOOM_STEP);
    if (newScale !== scale) {
      const rect = svgWrapper.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const scaleRatio = newScale / scale;
      translateX = centerX - (centerX - translateX) * scaleRatio;
      translateY = centerY - (centerY - translateY) * scaleRatio;
      scale = newScale;
    }
  }

  function zoomOut() {
    const newScale = Math.max(MIN_SCALE, scale - ZOOM_STEP);
    if (newScale !== scale) {
      const rect = svgWrapper.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const scaleRatio = newScale / scale;
      translateX = centerX - (centerX - translateX) * scaleRatio;
      translateY = centerY - (centerY - translateY) * scaleRatio;
      scale = newScale;
    }
  }

  function resetZoom() {
    scale = DEFAULT_SCALE;
    translateX = 0;
    translateY = 0;
  }

  $: if (svgContent) {
    resetZoom();
    clearTimeout(updateSizeTimeout);
    updateSizeTimeout = setTimeout(updateSvgSize, 0);
  }

  $: stripWidth = Math.max(svgWidth * 0.08, 0);
  $: stripHeight = Math.max(svgWidth * 0.03, 0);
  $: stripTop = Math.max(svgWidth * 0.035, 0); // calculate <top> positioning of strips relative to SVG height (SVG width is fixed)

  $: transformStyle = `transform: translate(${translateX}px, ${translateY}px) scale(${scale}); transform-origin: 0 0;`;

  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().includes("MAC");
  const zoomModifierKey = isMac ? "Cmd" : "Strg";

  onMount(() => {
    // Handles mouse release outside the container
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  });
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
    <div
      class="absolute top-4 right-4 z-10 flex flex-col gap-1 bg-white/90 rounded-lg shadow-lg p-1"
    >
      <button
        on:click={zoomIn}
        class="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700 text-xl font-bold"
        title="Vergrößern"
        aria-label="Vergrößern"
      >
        +
      </button>
      <button
        on:click={zoomOut}
        class="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700 text-xl font-bold"
        title="Verkleinern"
        aria-label="Verkleinern"
      >
        −
      </button>
      <div class="h-px bg-gray-200 mx-1"></div>
      <button
        on:click={resetZoom}
        class="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-700 text-xs font-medium"
        title="Zurücksetzen"
        aria-label="Zoom zurücksetzen"
      >
        {Math.round(scale * 100)}%
      </button>
    </div>

    <div
      class="absolute bottom-4 left-4 z-10 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded"
    >
      {zoomModifierKey} + Mausrad zum Zoomen, Ziehen zum Verschieben
    </div>

    <div class="flex-1 overflow-hidden relative">
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="absolute inset-0 cursor-grab"
        bind:this={svgWrapper}
        on:wheel={handleWheel}
        on:mousedown={handleMouseDown}
        on:mousemove={handleMouseMove}
      >
        <div
          class="min-h-min w-full p-20 flex items-start justify-center"
          style={transformStyle}
          bind:this={svgContainer}
        >
          <!-- tesa affiliate -->
          <div class="relative w-full pb-3">
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
            <!-- svgContent is loaded from trusted static files in /static/ebd/, not user input -->
            {@html svgContent}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
