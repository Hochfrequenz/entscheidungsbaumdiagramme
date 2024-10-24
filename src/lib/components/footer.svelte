<script>
  import { base } from "$app/paths";
  import { IconLogo } from "$lib";

  export let background = "bg-secondary";

  let currentYear = new Date().getFullYear();
</script>

<footer class="flex justify-between items-center {background} px-6 py-2.5">
  <a href="{base}/" title="landingpage" class="flex-none items-center">
    <IconLogo size={24} />
  </a>
  <div class="flex items-center text-sm text-white space-x-1">
    <p class="flex items-center flex-wrap">
      © {currentYear} - made with
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="white"
        class="w-5 h-5 mx-1"
      >
        <path
          d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z"
        />
      </svg>
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
