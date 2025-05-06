<script lang="ts">
  import IconPlant from "$lib/components/shared/icon-plant.svelte";

  export let formatVersion: string; // e.g. 'FV2410'
  export let ebdCode: string; // e.g. 'E_0404'

  // check for E_0594 to embed "HF erklärt - MaLoIdent-Prozess" youtube video
  $: isMaloIdent = formatVersion === "FV2504" && ebdCode === "E_0594";
</script>

<div class="flex flex-col h-full">
  <div
    class="flex flex-grow flex-col overflow-hidden items-center justify-center"
  >
    <div class="max-w-[50%] w-full">
      <div class="flex flex-wrap flex-row items-center gap-2 pb-10">
        <span class="text-2xl">
          Der gesuchte Entscheidungsbaum muss erst noch gepflanzt werden.
        </span>
        <div class="-mt-3">
          <IconPlant />
        </div>
      </div>

      <div class="rounded-3xl bg-primary px-6 py-8 mb-10 justify-center">
        <p class="text-xl text-black">
          Für das EBD <span class="font-bold">{ebdCode}</span>
          der Formatversion <span class="font-bold">{formatVersion}</span> ist aktuell
          leider kein Diagramm vorhanden.
        </p>
      </div>

      {#if isMaloIdent}
        <div class="mb-10 w-full">
          <div class="aspect-w-16 aspect-h-9 w-full">
            <iframe
              class="w-[446px] h-[250px] rounded-lg shadow-lg"
              src="https://www.youtube.com/embed/mHB6pEl5ik4"
              title="YouTube Video Player"
              frameborder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            >
            </iframe>
          </div>
        </div>
      {/if}

      <span class="block text-xl pb-10">
        <p>
          Mögliche Ursachen können beispielsweise Probleme beim Auslesen der
          Tabellen aus den Dokumenten des BDEW sein, sowie Prüflogiken, welche
          <span
            title="und damit keine Bäume oder DAGs, sondern zyklische Graphen sind."
            >Schleifen enthalten</span
          >. Falls du ein EBD nicht finden konntest oder fehlerhafte
          Prüfschritte entdeckt hast, arbeite gemeinsam mit uns an einer Lösung
          und trage zur Verbesserung unserer Backends
          <a
            href="https://github.com/Hochfrequenz/ebdamame/"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:underline text-primary font-medium mx-1">ebdamame</a
          >
          und
          <a
            href="https://github.com/Hochfrequenz/rebdhuhn/"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:underline text-primary font-medium mx-1">rebdhuhn</a
          >
          bei.
        </p>
        <p>
          <br />
          Melde dich bei uns einfach direkt über Github oder unser Kontaktformular
          und wir helfen dir beim Einstieg. Unterstütze uns auch gerne bei weiteren
          <a
            href="https://github.com/Hochfrequenz/"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:underline text-primary font-medium mx-1"
            >Open-Source-Projekten</a
          >
          von Hochfrequenz.
        </p>
      </span>
    </div>
  </div>
</div>
