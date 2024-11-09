<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import type { EbdNameExtended } from "$lib/types/metadata";

  import IconArrow from "../shared/icon-arrow.svelte";

  export let currentEbds: EbdNameExtended[] = [];
  export let currentFormatVersion: string = "";
  export let selectedEbdCode: string = "";

  $: currentIndex = currentEbds.findIndex(
    (ebd) => ebd.ebd_code === selectedEbdCode,
  );

  $: isFirstEbd = currentIndex === 0;
  $: isLastEbd = currentIndex === currentEbds.length - 1;

  function handleNavigation(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const ebdId = target.closest("svg")?.id;

    if (
      !ebdId ||
      !currentFormatVersion ||
      !selectedEbdCode ||
      !currentEbds.length
    ) {
      return;
    }

    if (currentIndex === -1) return;

    // set boundaries to disable navigation once the first/last EBD is reached
    if (ebdId === "previousEbd" && isFirstEbd) return;
    if (ebdId === "nextEbd" && isLastEbd) return;

    let newIndex: number;
    if (ebdId === "nextEbd") {
      newIndex = currentIndex + 1;
    } else if (ebdId === "previousEbd") {
      newIndex = currentIndex - 1;
    } else {
      return;
    }

    const newEbd = currentEbds[newIndex].ebd_code;
    goto(`${base}/ebd/${currentFormatVersion}/${newEbd}`);
  }
</script>

<div class="flex flex-col gap-1">
  <button
    on:click={handleNavigation}
    class="cursor-pointer"
    class:opacity-35={isLastEbd}
  >
    <IconArrow id="nextEbd" />
  </button>
  <button
    on:click={handleNavigation}
    class="cursor-pointer"
    class:opacity-35={isFirstEbd}
  >
    <IconArrow orientation="rotate-180" id="previousEbd" />
  </button>
</div>
