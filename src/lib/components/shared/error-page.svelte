<script lang="ts">
  import IconPlant from "$lib/components/shared/icon-plant.svelte";

  export let formatVersion: string; // e.g. 'FV2410'
  export let ebdCode: string; // e.g. 'E_0404'
</script>

<div class="flex flex-col h-full">
  <div
    class="flex flex-grow flex-col overflow-hidden items-center justify-center"
  >
    <div class="max-w-[50%] w-full">
      <div
        class="flex flex-wrap flex-row items-center gap-2 pb-10 justify-center"
      >
        <span class="text-2xl">
          Der gesuchte Entscheidungsbaum muss erst noch gepflanzt werden.
        </span>
        <div class="-mt-3">
          <IconPlant />
        </div>
      </div>

      <div class="rounded-3xl bg-primary p-8 mb-10 justify-center">
        <p class="text-xl text-black text-center">
          Für das EBD <span class="font-bold">{ebdCode}</span>
          der Formatversion <span class="font-bold">{formatVersion}</span> ist aktuell
          leider kein Diagramm vorhanden.
        </p>
      </div>

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
