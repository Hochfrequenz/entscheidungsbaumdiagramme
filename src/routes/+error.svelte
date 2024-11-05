<script lang="ts">
  import IconPlant from "$lib/components/shared/icon-plant.svelte";
  import LandingpageButton from "$lib/components/shared/landingpage-button.svelte";
</script>

<div class="flex flex-col h-full">
  <div
    class="flex flex-grow flex-col overflow-hidden items-center justify-center"
  >
    <div class="flex flex-row">
      <span class="text-xl pr-1">
        Der gesuchte Entscheidungsbaum muss erst noch gepflanzt werden
      </span>
      <IconPlant />
    </div>

    <span class="flex text-xl">
      Unterstütze uns dafür gerne im Backend von&nbsp;
      <a
        href="https://github.com/Hochfrequenz/ebdamame/"
        class="hover:underline text-secondary">ebdamame</a
      >
      &nbsp;und&nbsp;
      <a
        href="https://github.com/Hochfrequenz/rebdhuhn/"
        class="hover:underline text-secondary">rebdhuhn</a
      >
    </span>
    <span class="flex text-xl pb-10">
      &nbsp;oder bei weiteren Open-Source-Projekten von&nbsp;
      <a
        href="https://github.com/Hochfrequenz/"
        class="hover:underline text-secondary">Hochfrequenz</a
      >
      .
    </span>
    <LandingpageButton />
  </div>
</div>
