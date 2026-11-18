<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import {
    buildGraph,
    computeWay,
    type EbdGraph,
    listResultGroups,
    type ResultGroup,
    type Way,
    WILDCARD_KEY,
  } from "$lib/ebd-way";

  export let svgContent: string = "";
  export let isLoading: boolean = false;
  export let error: string | null = null;
  // result groups of the shown EBD and the selected one (key); both are shared with the select in the toolbar
  export let groups: ResultGroup[] = [];
  export let selectedGroup: string = "";

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

  const CLICK_TOLERANCE_PX = 4; // a mouse movement beyond this between mousedown and click is a pan, not a click
  const FIT_PADDING = 0.9; // share of the view the highlighted way may fill
  const FIT_MAX_SCALE = 2;
  const FIT_TOP_INSET = 80; // keeps the way clear of the status chip at the top
  let downX = 0;
  let downY = 0;
  let hasDown = false;
  let graph: EbdGraph | null = null;
  let way: Way | null = null;
  let nodeElements: { title: string; el: Element }[] = [];
  let edgeElements: { title: string; el: Element }[] = [];
  let selectionFromClick = false;

  let disconnectSizeObserver: (() => void) | undefined;

  function updateSvgSize() {
    disconnectSizeObserver?.();
    disconnectSizeObserver = undefined;
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
      disconnectSizeObserver = () => observer.disconnect();
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
    downX = event.clientX;
    downY = event.clientY;
    hasDown = true;
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

  function titleOf(el: Element): string {
    return el.querySelector(":scope > title")?.textContent ?? "";
  }

  // reads node and edge titles from the inlined SVG (the adapter for the pure module in $lib/ebd-way)
  function readGraph() {
    nodeElements = [];
    edgeElements = [];
    graph = null;
    way = null;
    if (!svgContainer) return;
    nodeElements = [...svgContainer.querySelectorAll("g.node")].map((el) => ({
      title: titleOf(el),
      el,
    }));
    edgeElements = [...svgContainer.querySelectorAll("g.edge")].map((el) => ({
      title: titleOf(el),
      el,
    }));
    graph = buildGraph(
      nodeElements.map((n) => n.title),
      edgeElements.map((e) => e.title),
    );
    groups = listResultGroups(graph);
    for (const { title, el } of nodeElements) {
      el.classList.toggle(
        "ebdway-clickable",
        graph.kinds.get(title) === "result",
      );
    }
  }

  onDestroy(() => {
    clearTimeout(updateSizeTimeout);
    disconnectSizeObserver?.();
  });

  function afterSvgChange() {
    updateSvgSize();
    readGraph();
  }

  $: if (svgContent && !isLoading) {
    resetZoom();
    selectedGroup = "";
    clearTimeout(updateSizeTimeout);
    updateSizeTimeout = setTimeout(afterSvgChange, 0);
  }

  const WAY_CLASSES = ["ebdway-every", "ebdway-some", "ebdway-faded"];

  function applyHighlight(key: string, currentGraph: EbdGraph | null) {
    const group = currentGraph && groups.find((g) => g.key === key);
    way = currentGraph && group ? computeWay(currentGraph, group) : null;
    const active = way?.reachable ? way : null;
    for (const { title, el } of nodeElements) {
      el.classList.remove(...WAY_CLASSES);
      if (!active || !currentGraph) continue;
      if (currentGraph.kinds.get(title) === "note") continue;
      if (active.nodesOnEveryWay.has(title)) el.classList.add("ebdway-every");
      else if (active.nodesOnWay.has(title)) el.classList.add("ebdway-some");
      else el.classList.add("ebdway-faded");
    }
    edgeElements.forEach(({ el }, index) => {
      el.classList.remove(...WAY_CLASSES);
      if (!active) return;
      if (active.edgesOnEveryWay.has(index)) el.classList.add("ebdway-every");
      else if (active.edgesOnWay.has(index)) el.classList.add("ebdway-some");
      else el.classList.add("ebdway-faded");
    });
    if (active && !selectionFromClick) fitToWay(active);
    selectionFromClick = false;
  }

  $: applyHighlight(selectedGroup, graph);

  // pans and zooms so that the highlighted way fills the view (only used when the result was chosen in the select)
  function fitToWay(active: Way) {
    if (!svgWrapper || !svgContainer) return;
    const wrapperRect = svgWrapper.getBoundingClientRect();
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    const include = (el: Element) => {
      const r = el.getBoundingClientRect();
      left = Math.min(left, r.left);
      top = Math.min(top, r.top);
      right = Math.max(right, r.right);
      bottom = Math.max(bottom, r.bottom);
    };
    for (const { title, el } of nodeElements)
      if (active.nodesOnWay.has(title)) include(el);
    edgeElements.forEach(({ el }, index) => {
      if (active.edgesOnWay.has(index)) include(el);
    });
    if (!isFinite(left) || wrapperRect.width === 0 || wrapperRect.height === 0)
      return;
    // back to the coordinates of the untransformed content
    const x0 = (left - wrapperRect.left - translateX) / scale;
    const x1 = (right - wrapperRect.left - translateX) / scale;
    const y0 = (top - wrapperRect.top - translateY) / scale;
    const y1 = (bottom - wrapperRect.top - translateY) / scale;
    const fit = Math.min(
      (wrapperRect.width * FIT_PADDING) / Math.max(x1 - x0, 1),
      ((wrapperRect.height - FIT_TOP_INSET) * FIT_PADDING) /
        Math.max(y1 - y0, 1),
    );
    const newScale = Math.min(
      FIT_MAX_SCALE,
      MAX_SCALE,
      Math.max(MIN_SCALE, fit),
    );
    translateX = wrapperRect.width / 2 - ((x0 + x1) / 2) * newScale;
    translateY =
      FIT_TOP_INSET +
      (wrapperRect.height - FIT_TOP_INSET) / 2 -
      ((y0 + y1) / 2) * newScale;
    scale = newScale;
  }

  function handleClick(event: MouseEvent) {
    const moved =
      hasDown &&
      Math.hypot(event.clientX - downX, event.clientY - downY) >
        CLICK_TOLERANCE_PX;
    hasDown = false;
    if (moved) return; // end of a pan
    const target = event.target as Element | null;
    if (!target || !graph) return;
    // links inside the diagram (e.g. to another EBD) keep working as links and do not change the highlight
    if (target.closest("a")) return;
    if (target.closest("g.edge")) return; // arrows neither select nor clear
    const node = target.closest("g.node");
    if (!node) {
      clearSelection(); // background
      return;
    }
    const title = titleOf(node);
    if (graph.kinds.get(title) !== "result") return;
    const key = groups.find((g) => g.nodes.includes(title))?.key ?? "";
    selectionFromClick = true;
    selectedGroup = selectedGroup === key ? "" : key;
  }

  function clearSelection() {
    if (selectedGroup) {
      selectionFromClick = true;
      selectedGroup = "";
    }
  }

  function clearViaChip() {
    clearSelection();
    // the button disappears with the chip, so give the focus to the select
    document.getElementById("result-select")?.focus();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== "Escape") return;
    const target = event.target as Element | null;
    // Esc inside other selects or inputs belongs to that control; the result select itself clears
    if (
      target?.closest("select, input, textarea") &&
      target.id !== "result-select"
    )
      return;
    clearSelection();
  }

  $: selection = groups.find((g) => g.key === selectedGroup);
  $: showWildcardHint =
    !!selection &&
    selection.key !== WILDCARD_KEY &&
    groups.some((g) => g.key === WILDCARD_KEY);

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
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeydown);
    };
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
      {zoomModifierKey} + Mausrad zum Zoomen, Ziehen zum Verschieben, Ergebnis anklicken:
      Weg hervorheben
    </div>

    <!-- the live region stays in the DOM so that changes of its content are announced -->
    <div class="absolute top-4 left-4 right-20 z-10" role="status">
      {#if selection}
        <div
          class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-800 bg-white/90 rounded-lg shadow-lg px-3 py-2"
        >
          <span class="font-bold">{selection.label}</span>
          {#if way?.reachable}
            <span>– Weg hervorgehoben:</span>
            <span class="inline-flex items-center gap-1">
              <svg width="22" height="8" aria-hidden="true">
                <line
                  x1="0"
                  y1="4"
                  x2="22"
                  y2="4"
                  stroke="black"
                  stroke-width="4"
                />
              </svg>
              auf jedem Weg
            </span>
            <span class="inline-flex items-center gap-1">
              <svg width="22" height="8" aria-hidden="true">
                <line
                  x1="0"
                  y1="4"
                  x2="22"
                  y2="4"
                  stroke="black"
                  stroke-width="2"
                  stroke-dasharray="4 3"
                />
              </svg>
              nur auf manchen Wegen
            </span>
          {:else}
            <span>– vom Start aus nicht erreichbar</span>
          {/if}
          {#if selection.nodes.length > 1}
            <span class="text-gray-600"
              >{selection.nodes.length} Kästen mit {selection.label}</span
            >
          {/if}
          {#if showWildcardHint}
            <span class="text-gray-600"
              >Dieses EBD hat ein Ergebnis A** – dein Code kann auch von dort
              stammen</span
            >
          {/if}
          <button
            type="button"
            class="ml-auto w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700"
            title="Hervorhebung aufheben"
            aria-label="Hervorhebung aufheben"
            on:click={clearViaChip}
          >
            ×
          </button>
        </div>
      {/if}
    </div>

    <div class="flex-1 overflow-hidden relative">
      <!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
      <div
        class="absolute inset-0 cursor-grab select-none"
        bind:this={svgWrapper}
        on:wheel={handleWheel}
        on:mousedown={handleMouseDown}
        on:mousemove={handleMouseMove}
        on:click={handleClick}
      >
        <div
          class="ebdway-root min-h-min w-full p-20 flex items-start justify-center"
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

<style>
  /* The highlight is applied as classes on the live DOM of the inlined SVG, never to svgContent (exports stay plain). */
  .ebdway-root :global(g.node.ebdway-clickable) {
    cursor: pointer;
  }
  .ebdway-root :global(.ebdway-faded) {
    opacity: 0.12;
  }
  .ebdway-root :global(.ebdway-some) {
    opacity: 0.7;
  }
  /* descendant selectors: a node that is a link has its shape below g > g > a */
  .ebdway-root :global(g.node.ebdway-every :is(path, polygon, ellipse)),
  .ebdway-root :global(g.node.ebdway-some :is(path, polygon, ellipse)) {
    stroke: #000;
  }
  .ebdway-root :global(g.node.ebdway-every :is(path, polygon, ellipse)) {
    stroke-width: 3;
  }
  .ebdway-root :global(g.node.ebdway-some :is(path, polygon, ellipse)) {
    stroke-width: 2;
    stroke-dasharray: 7 4;
  }
  .ebdway-root :global(g.edge.ebdway-every > path) {
    stroke-width: 3.5;
  }
  .ebdway-root :global(g.edge.ebdway-some > path) {
    stroke-width: 2;
    stroke-dasharray: 7 4;
  }
</style>
