<script lang="ts">
  import { onMount } from "svelte";

  import { base } from "$app/paths";
  import { IconDownload } from "$lib/components";
  import { isMissingEbd } from "$lib/data/missing-ebds";

  export let currentFormatVersion: string = "";
  export let currentEbd: string = "";
  export let isDisabled: boolean = false;

  let isExportReady = true;
  let cooldownTimer: ReturnType<typeof setTimeout>;
  let remainingSeconds = 0;
  let downloadStarted = false;
  let isPumlAvailable = false;

  onMount(() => {
    return () => {
      if (cooldownTimer) clearTimeout(cooldownTimer);
    };
  });

  // check if PUML file is availabe (roughly 75% of SVGs have an associated PUML file)
  $: if (currentFormatVersion && currentEbd) {
    checkPumlAvailability();
  }

  async function checkPumlAvailability() {
    if (!currentFormatVersion || !currentEbd) {
      isPumlAvailable = false;
      return;
    }

    if (isMissingEbd(currentFormatVersion, currentEbd)) {
      isPumlAvailable = false;
      return;
    }

    const pumlPath = `${base}/ebd/${currentFormatVersion}/${currentEbd}.puml`;

    try {
      const response = await fetch(pumlPath, { method: "HEAD" });
      isPumlAvailable = response.ok;
    } catch (err) {
      console.error(`Error checking PUML availability: ${err}`);
      isPumlAvailable = false;
    }
  }

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
    if (
      isDisabled ||
      !isExportReady ||
      !currentFormatVersion ||
      !currentEbd ||
      !isPumlAvailable
    )
      return;

    isExportReady = false;
    const pumlPath = `${base}/ebd/${currentFormatVersion}/${currentEbd}.puml`;

    try {
      const response = await fetch(pumlPath);
      if (!response.ok) {
        throw new Error(`http error: ${response.status}`);
      }
      const pumlContent = await response.text();

      const blob = new Blob([pumlContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentFormatVersion}_${currentEbd}.puml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      startCooldownTimer();
    } catch (err) {
      console.error(`error exporting puml: ${err}`);
      isExportReady = true;
    }
  }
</script>

{#if isPumlAvailable}
  <button
    on:click={handleExport}
    class="flex flex-row items-center gap-2 rounded-full bg-secondary text-[16px] py-3 px-5 text-black/70 transition-opacity duration-200 whitespace-nowrap min-w-[150px] justify-center"
    class:opacity-30={isDisabled || !isExportReady}
    class:cursor-not-allowed={!isExportReady}
    disabled={isDisabled || !isExportReady}
  >
    {#if downloadStarted}
      {remainingSeconds} s
    {:else}
      <IconDownload /> Export PUML
    {/if}
  </button>
{/if}
