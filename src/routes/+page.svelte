<script lang="ts">
  import "$src/app.scss";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import {
    AuthButton,
    IconSquareArrow,
    LandingpageBanner,
  } from "$lib/components";
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

<div class="relative">
  <div class="absolute top-4 right-4 z-10">
    <AuthButton />
  </div>
</div>

<section class="bg-primary flex-grow flex items-center justify-center pt-40">
  <div class="rounded-lg bg-tint p-12 shadow-md w-1/2">
    <h2
      class="border-b border-secondary inline-block pb-[10px] text-2xl uppercase text-center w-full"
    >
      Entscheidungsbaumdiagramme - als Diagramme
    </h2>
    <p class="text-base text-justify pt-[20px]">
      Wer mit den vom BDEW veröffentlichten Entscheidungsbaumdiagrammen (EBDs)
      arbeitet weiß: Die tabellarische Form ist sperrig und mindestens
      unübersichtlich. Unsere automatisch generierten EBDs von Hochfrequenz sind
      hingegen echte Diagramme - lesbar und nutzungsfreundlich.
    </p>
    <p class="text-base text-justify pt-[20px]">
      Die auf bdew-mako.de veröffentlichten Word-Dateien werden von uns
      vollautomatisch ausgelesen. Aus den so gewonnenen Rohdaten erstellt unsere
      Software anschließend ebenso automatisiert Diagramme, welche inhaltlich zu
      100% den offiziellen BDEW-Dokumenten entsprechen. Diese Diagramme sollen
      Fachbereichen und Menschen mit Prozess-Expertise dabei unterstützen, ihre
      Systeme fit für neue oder angepasste Prüflogiken zu machen. Auf Grundlage
      echter Diagramme lässt sich viel leichter überblicken, an welcher Stelle
      Implementierungsaufwände anfallen, ohne dabei den Gesamtprozess aus den
      Augen zu verlieren.
    </p>
    <p class="text-base text-justify pt-[20px]">
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
<section class="pb-8 bg-primary">
  <LandingpageBanner />
</section>
