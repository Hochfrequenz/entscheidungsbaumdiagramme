<script>
  import { onMount } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { fly } from "svelte/transition";

  let visible = false;

  onMount(() => {
    visible = true;
  });
</script>

<div class="flex justify-evenly w-full p-5 pt-10">
  {#if visible}
    <div
      class="flex flex-col items-center rounded-lg bg-hf-ahbtabellen p-8 shadow-md w-1/5 aspect-square"
      in:fly={{ x: -500, duration: 1000, delay: 250, easing: cubicOut }}
    >
      <a
        href="https://ahb-tabellen.stage.hochfrequenz.de"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col items-center group"
      >
        <div
          class="transform transition-transform duration-300 ease-in-out group-hover:scale-110 flex flex-col items-center"
        >
          <p class="text-xl text-center">AHB Tabellen</p>
        </div>
      </a>
      <p class="text-sm text-justify pt-4 overflow-auto">
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      </p>
    </div>

    <div
      class="flex flex-col items-center rounded-lg bg-hf-bedingungsbaum p-8 shadow-md w-1/5 aspect-square"
      in:fly={{ x: -500, duration: 1000, delay: 500, easing: cubicOut }}
    >
      <a
        href="https://bedingungsbaum.hochfrequenz.de"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col items-center group"
      >
        <div
          class="transform transition-transform duration-300 ease-in-out group-hover:scale-110 flex flex-col items-center"
        >
          <p class="text-xl text-current text-center">Bedingungsbaum</p>
        </div>
      </a>
      <p class="text-sm text-justify pt-4 overflow-auto">
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      </p>
    </div>

    <div
      class="flex flex-col items-center rounded-lg bg-hf-fristenkalender p-8 shadow-md w-1/5 aspect-square"
      in:fly={{ x: -500, duration: 1250, delay: 750, easing: cubicOut }}
    >
      <a
        href="https://hochfrequenz.de/#fristenkalender"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col items-center group"
      >
        <div
          class="transform transition-transform duration-300 ease-in-out group-hover:scale-110 flex flex-col items-center"
        >
          <p class="text-xl text-center">Fristenkalender</p>
        </div>
      </a>
      <p class="text-sm text-justify pt-4 overflow-auto">
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      </p>
    </div>
  {/if}
</div>
