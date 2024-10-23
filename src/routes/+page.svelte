<script>
  import "../app.scss";

  import { base } from "$app/paths";
  import { ToolsBanner } from "$lib";
</script>

<section class="bg-secondary flex-grow flex items-center justify-center">
  <div class="rounded-lg bg-tint p-12 shadow-md">
    <h1 class="text-2xl pb-5">Entscheidungsbaumdiagramme</h1>
    <h2
      class="flex justify-center text-sm border-b border-secondary pb-[12px] mb-[20px] uppercase"
    >
      - aber es sind actually Diagramme.
    </h2>
    <div class="mt-10 flex justify-center">
      <a
        href="{base}/ebd"
        class="rounded-full bg-secondary text-white px-5 py-2 shadow-md inline-block no-underline transition-transform duration-300 ease-in-out hover:scale-110"
      >
        Jetzt öffnen
      </a>
    </div>
  </div>
</section>
<section class="pb-8">
  <ToolsBanner />
</section>
