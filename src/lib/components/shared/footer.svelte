<script>
  import { base } from "$app/paths";
  import { IconHeart, IconLogo } from "$lib/components";

  export let background = "bg-primary";

  let currentYear = new Date().getFullYear();
</script>

<footer class="flex justify-between items-center {background} px-6 py-2.5">
  <a href="{base}/" title="landingpage" class="flex-none items-center">
    <IconLogo size={24} />
  </a>
  <div class="flex items-center text-sm text-white space-x-1">
    <p class="flex items-center flex-wrap">
      © {currentYear} - made with
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
