<script lang="ts">
  import IconPlant from "$lib/components/shared/icon-plant.svelte";
  import LandingpageButton from "$lib/components/shared/landingpage-button.svelte";
</script>

<div class="flex flex-col h-full justify-center">
  <div
    class="flex flex-grow flex-col overflow-hidden items-center justify-center"
  >
    <div class="flex flex-wrap flex-row text-center justify-center">
      <span class="text-4xl pb-8 pr-2">
        Der gesuchte Entscheidungsbaum muss erst noch gepflanzt werden
      </span>
      <IconPlant />
    </div>

    <span
      class="flex flex-wrap text-2xl justify-center text-center pb-10 max-w-prose"
    >
      Falls du ein EBD nicht finden konntest oder fehlerhafte Prüfschritte
      entdeckt hast, arbeite gerne mit uns zusammen und trag zur Verbesserung
      unserer Backends
      <a
        href="https://github.com/Hochfrequenz/ebdamame/"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:underline text-secondary font-medium mx-1">ebdamame</a
      >
      und
      <a
        href="https://github.com/Hochfrequenz/rebdhuhn/"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:underline text-secondary font-medium mx-1">rebdhuhn</a
      >
      bei.
    </span>
    <span
      class="flex flex-wrap text-2xl justify-center text-center pb-10 max-w-prose"
    >
      Unterstütze uns auch gerne bei weiteren
      <a
        href="https://github.com/Hochfrequenz/"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:underline text-secondary font-medium mx-1"
        >Open-Source-Projekten</a
      >
      von Hochfrequenz.
    </span>

    <LandingpageButton />
  </div>
</div>
