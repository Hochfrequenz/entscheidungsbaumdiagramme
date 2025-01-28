<script lang="ts">
  import IconPlant from "$lib/components/shared/icon-plant.svelte";
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
        <div class="-mt-2">
          <IconPlant />
        </div>
      </div>

      <span class="block text-xl pb-10">
        Es kann leider vorkommen, dass EBDs nicht auf dieser Website verfügbar
        sind. Mögliche Ursachen könnten z.B. Probleme beim Auslesen der
        Word-Tabellen aus den BDEW-Dokumenten sein, oder Prüflogiken, die
        <span
          title="Und damit keine Bäume oder DAGs, sondern zyklische Graphen sind"
          >Schleifen enthalten</span
        >. Falls du ein EBD nicht finden konntest oder fehlerhafte Prüfschritte
        entdeckt hast, arbeite gerne mit uns zusammen und trag zur Verbesserung
        unserer Backends
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
        bei.<br>Schreib uns einfach direkt über Github oder unser Kontaktformular und
        wir helfen gerne beim Einstieg.
      </span>
      <span class="block text-xl pb-10">
        Unterstütze uns auch gerne bei weiteren
        <a
          href="https://github.com/Hochfrequenz/"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:underline text-primary font-medium mx-1"
          >Open-Source-Projekten</a
        >
        von Hochfrequenz.
      </span>
    </div>
  </div>
</div>
