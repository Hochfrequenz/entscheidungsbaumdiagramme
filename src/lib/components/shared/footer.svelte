<script lang="ts">
  import { onMount } from "svelte";

  import { base } from "$app/paths";
  import { IconHeart, IconLogoWithText } from "$lib/components";

  let currentYear = new Date().getFullYear();

  type VersionInfo = {
    build_branch_or_tag: string;
    commit_hash: string;
    build_date: string;
  };
  let versionInfo: VersionInfo | null = null;

  onMount(async () => {
    const response = await fetch(`${base}/version.json`);
    const data: VersionInfo = await response.json();
    versionInfo = data;
  });
</script>

<footer class="relative flex items-center bg-secondary px-6 py-4">
  <a href="{base}/" title="landingpage" class="absolute left-6">
    <IconLogoWithText width={160} />
  </a>
  <div
    class="flex-1 flex justify-center items-center text-sm text-black space-x-1"
  >
    <p class="flex items-center flex-wrap">
      © {currentYear}
      {#if versionInfo}
        <span class="mx-1"> - </span>
        <a
          href="/version.json"
          class="mx-1 cursor-pointer"
          title="commit {versionInfo.commit_hash} built on {versionInfo.build_date}"
          >{versionInfo.build_branch_or_tag}
        </a>
      {/if}
      <span class="mx-1"> - made with </span>
      <IconHeart />
      <span class="mx-1"> by </span>
      <a class="font-bold mr-2" href="https://hochfrequenz.de">Hochfrequenz</a>
      |
      <span class="ml-2">powered by</span>
      <a class="font-bold mx-1" href="https://github.com/hochfrequenz/ebdamame"
        ><code>ebdamame</code></a
      >
      &amp;
      <a
        class="font-bold ml-1 mr-2"
        href="https://github.com/hochfrequenz/rebdhuhn"><code>rebdhuhn</code></a
      >
      |
      <a
        class="mx-2"
        target="_blank"
        href="https://www.hochfrequenz.de/datenschutz/">Datenschutz</a
      >
      |
      <a
        class="mx-2"
        target="_blank"
        href="https://www.hochfrequenz.de/impressum/">Impressum</a
      >
      |
      <a
        class="mx-2"
        target="_blank"
        href="https://www.hochfrequenz.de/kontakt/">Kontakt</a
      >
    </p>
  </div>
</footer>
