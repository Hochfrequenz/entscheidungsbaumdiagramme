<script lang="ts">
  import "$src/app.scss";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { IconSquareArrow } from "$lib/components";
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
  <div class="rounded-3xl bg-secondary p-12 shadow-md w-1/2">
    <h2
      class="border-b border-secondary inline-block pb-[10px] text-2xl uppercase w-full"
    >
      Entscheidungsbaumdiagramme - als Diagramme
    </h2>
    <p class="text-base pt-[20px] font-normal">
      Wer mit den vom BDEW veröffentlichten Entscheidungsbaumdiagrammen (EBDs)
      arbeitet weiß: Die tabellarische Form ist sperrig und mindestens
      unübersichtlich. Unsere automatisch generierten EBDs von Hochfrequenz sind
      hingegen echte Diagramme - lesbar und nutzungsfreundlich.
    </p>
    <p class="text-base pt-[20px] font-normal">
      Die auf
      <a href="https://bdew-mako.de" class="text-base pt-[20px] text-primary">
        bdew-mako.de
      </a>
      veröffentlichten Word-Dateien werden von uns vollautomatisch ausgelesen. Aus
      den so gewonnenen Rohdaten erstellt unsere Software anschließend ebenso automatisiert
      Diagramme, welche inhaltlich zu 100% den offiziellen BDEW-Dokumenten entsprechen.
      Diese Diagramme sollen Fachbereichen und Menschen mit Prozess-Expertise dabei
      unterstützen, ihre Systeme fit für neue oder angepasste Prüflogiken zu machen.
      Auf Grundlage echter Diagramme lässt sich viel leichter überblicken, an welcher
      Stelle Implementierungsaufwände anfallen, ohne dabei den Gesamtprozess aus
      den Augen zu verlieren.
    </p>
    <p class="text-base pt-[20px] font-normal">
      Die Diagramme können entweder als SVG-Dateien heruntergeladen werden, oder
      auch als puml, um entsprechend eigene Erweiterungen, Notizen usw. darin
      abzubilden.
    </p>
    <p
      class="flex justify-center text-sm border-secondary pb-3 mb-5 uppercase"
    ></p>
    <div class="mt-10 flex justify-center">
      <button
        on:click={checkAuthentication}
        class="flex flex-row items-center gap-2 rounded-full bg-primary text-white px-5 py-2 shadow-md no-underline transition-transform duration-300 ease-in-out hover:scale-110"
      >
        <IconSquareArrow /> Jetzt öffnen
      </button>
    </div>
  </div>
</section>
