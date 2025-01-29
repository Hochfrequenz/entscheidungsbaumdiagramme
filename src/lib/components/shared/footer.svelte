<script lang="ts">
  import { onMount } from "svelte";

  import { base } from "$app/paths";
  import { IconHeart, IconLogo } from "$lib/components";
  
  let currentYear = new Date().getFullYear();

  type VersionInfo = {
    version_tag: string,
    commit_hash: string,
    build_date: string,
  };
  let versionTag: string | null = null;

  onMount(async () => {
    const response = await fetch(`${base}/version.json`);
    const data: VersionInfo = await response.json();
    versionTag = data.version_tag;
  });
</script>

<footer class="flex items-center bg-tint px-3 py-3">
  <div class="flex-1 flex justify-center">
    <div class="flex items-center text-sm text-black/70 gap-10 text-center">
      <a
        href="https://ahb-tabellen.hochfrequenz.de"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-row items-center rounded-full bg-ahb_primary text-white text-lg px-5 py-1
            shadow-lg
            ring-1
            ring-black/5
            hover:ring-black/10
            transition-all
            duration-300
            ease-in-out
            hover:scale-110"
      >
        AHB-Tabellen
      </a>
      <a
        href="https://bedingungsbaum.hochfrequenz.de"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-row items-center rounded-full bg-bedingungsbaum_primary text-white text-lg px-5 py-1
            shadow-lg
            ring-1
            ring-black/5
            hover:ring-black/10
            transition-all
            duration-300
            ease-in-out
            hover:scale-110"
      >
        Bedingungsbaum
      </a>
      <a
        href="https://ebd.hochfrequenz.de"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-row items-center rounded-full bg-ebd_primary text-white text-lg px-5 py-1
            shadow-lg
            ring-1
            ring-black/5
            hover:ring-black/10
            transition-all
            duration-300
            ease-in-out
            hover:scale-110"
      >
        Entscheidungsbaumdiagramme
      </a>
      <a
        href="https://fristenkalender.hochfrequenz.de"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-row items-center rounded-full bg-fristenkalender_primary text-white text-lg px-5 py-1
            shadow-lg
            ring-1
            ring-black/5
            hover:ring-black/10
            transition-all
            duration-300
            ease-in-out
            hover:scale-110"
      >
        Fristenkalender
      </a>
    </div>
  </div>
</footer>
<footer class="flex justify-between items-center bg-secondary px-6 py-2.5">
  <a href="{base}/" title="landingpage" class="flex-none items-center">
    <IconLogo size={24} />
  </a>
  <div class="flex items-center text-sm text-black space-x-1">
    <p class="flex items-center flex-wrap">
      © {currentYear}
      {#if versionTag}
        -
        <a
          href="{base}/version/"
          class="hover:underline font-bold mx-1"
          title="Version details"
        >{versionTag}
        </a>
      {/if}

      - made with
      <IconHeart />
      by
      <a class="font-bold ml-1 mr-2" href="https://hochfrequenz.de"
        >Hochfrequenz</a
      >
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
  <div class="w-[23px]"></div>
</footer>
