<script lang="ts">
  import "$src/app.scss";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { IconLogin } from "$lib/components";
  import auth from "$src/auth/authService";
  import { isAuthenticated } from "$src/store";

  async function checkAuthentication() {
    if ($isAuthenticated) {
      goto(`${base}/ebd`);
    } else {
      await auth.loginWithRedirect();
    }
  }
</script>

<section class="bg-primary flex-grow flex items-center justify-center">
  <div class="rounded-3xl bg-secondary p-12 shadow-md w-1/3">
    <h1 class="text-3xl text-black/70 pb-5">Entscheidungsbaumdiagramme</h1>
    <h2
      class="flex text-lg border-b-2 border-primary text-black/70 pb-3 mb-5 uppercase"
    >
      als Diagramme
    </h2>
    <p
      class="text-black/70 space-y-3 border-b-2 border-dashed border-primary pb-5"
    >
      Wer mit den vom BDEW unter
      <a href="https://bdew-mako.de" class="text-base pt-[20px] text-primary">
        bdew-mako.de
      </a>
      veröffentlichten Entscheidungsbaumdiagrammen (EBDs) arbeitet weiß: Die tabellarische
      Form ist sperrig und mindestens unübersichtlich. Unsere automatisch generierten
      EBDs von Hochfrequenz sind hingegen echte Diagramme - lesbar, übersichtlich
      und nutzungsfreundlich.
    </p>
    <div class="text-hf-weiches-schwarz text-sm mt-5 opacity-50 italic">
      <span class="font-medium">DISCLAIMER:</span> Wir geben unser Bestes, dass alle
      Daten korrekt und vollständig sind – können aber trotzdem nicht ausschließen,
      dass sich vereinzelt Fehler einschleichen.
    </div>
    <p
      class="flex justify-center text-sm border-secondary pb-3 mb-5 uppercase"
    ></p>
    <div class="mt-10 flex justify-center">
      <button
        on:click={checkAuthentication}
        class="flex flex-row items-center gap-2 rounded-full bg-primary text-white px-5 py-2 shadow-md no-underline"
      >
        <IconLogin /> Jetzt öffnen
      </button>
    </div>
  </div>
</section>
