<script lang="ts">
  import { onMount } from "svelte";

  import { base } from "$app/paths";
  import { IconDownload } from "$lib/components";

  export let currentFormatVersion: string = "";
  export let currentEbd: string = "";
  export let isDisabled: boolean = false;

  let isExportReady = true;
  let cooldownTimer: ReturnType<typeof setTimeout>;
  let remainingSeconds = 0;
  let downloadStarted = false;

  onMount(() => {
    return () => {
      if (cooldownTimer) clearTimeout(cooldownTimer);
    };
  });

  // 5 seconds cooldown to prevent download from being spammed
  function startCooldownTimer() {
    remainingSeconds = 5;
    downloadStarted = true;

    const updateTimer = () => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        cooldownTimer = setTimeout(updateTimer, 1000);
      } else {
        isExportReady = true;
        downloadStarted = false;
      }
    };

    cooldownTimer = setTimeout(updateTimer, 1000);
  }

  async function handleExport() {
    if (isDisabled || !isExportReady || !currentFormatVersion || !currentEbd)
      return;

    isExportReady = false;
    const ebdPath = `${base}/ebd/${currentFormatVersion}/${currentEbd}.svg`;

    try {
      const response = await fetch(ebdPath);
      if (!response.ok) {
        throw new Error(`http error: ${response.status}`);
      }
      const svgContent = await response.text();

      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentFormatVersion}-${currentEbd}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      startCooldownTimer();
    } catch (err) {
      console.error(`error exporting svg: ${err}`);
      isExportReady = true;
    }
  }
</script>

<button
  on:click={handleExport}
  class="flex flex-row items-center gap-2 rounded-full bg-secondary text-[16px] py-4 px-5 text-black transition-opacity duration-200 whitespace-nowrap min-w-[150px] justify-center"
  class:opacity-30={isDisabled || !isExportReady}
  class:cursor-not-allowed={!isExportReady}
  disabled={isDisabled || !isExportReady}
>
  {#if downloadStarted}
    {remainingSeconds} s
  {:else}
    <IconDownload /> Export SVG
  {/if}
</button>
