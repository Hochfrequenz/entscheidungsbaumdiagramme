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
      class="flex flex-col items-center"
      in:fly={{ x: -500, duration: 1000, delay: 250, easing: cubicOut }}
    >
      <a
        href="https://ahb-tabellen.stage.hochfrequenz.de"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col items-center text-secondary hover:text-secondary-focus group"
      >
        <div
          class="transform transition-transform duration-300 ease-in-out group-hover:scale-110 flex flex-col items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-20 fill-current mb-2"
          >
            <path
              d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z"
            />
          </svg>
          <p class="text-xl text-current text-center">AHB Tabellen</p>
        </div>
      </a>
      <p class="text-sm text-justify pt-4 px-40">
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      </p>
    </div>

    <div
      class="flex flex-col items-center"
      in:fly={{ x: -500, duration: 1000, delay: 500, easing: cubicOut }}
    >
      <a
        href="https://bedingungsbaum.hochfrequenz.de"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col items-center text-secondary hover:text-secondary-focus group"
      >
        <div
          class="transform transition-transform duration-300 ease-in-out group-hover:scale-110 flex flex-col items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="size-20 stroke-current mb-2"
          >
            <path
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 20a2 2 0 1 0-4 0a2 2 0 0 0 4 0M16 4a2 2 0 1 0-4 0a2 2 0 0 0 4 0m0 16a2 2 0 1 0-4 0a2 2 0 0 0 4 0m-5-8a2 2 0 1 0-4 0a2 2 0 0 0 4 0m10 0a2 2 0 1 0-4 0a2 2 0 0 0 4 0M5.058 18.306l2.88-4.606m2.123-3.397l2.877-4.604m-2.873 8.006l2.876 4.6M15.063 5.7l2.881 4.61"
            />
          </svg>
          <p class="text-xl text-current text-center">Bedingungsbaum</p>
        </div>
      </a>
      <p class="text-sm text-justify pt-4 px-40">
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      </p>
    </div>

    <div
      class="flex flex-col items-center"
      in:fly={{ x: -500, duration: 1250, delay: 750, easing: cubicOut }}
    >
      <a
        href="https://hochfrequenz.de/#fristenkalender"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col items-center text-secondary hover:text-secondary-focus group"
      >
        <div
          class="transform transition-transform duration-300 ease-in-out group-hover:scale-110 flex flex-col items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-20 fill-current mb-2"
          >
            <path
              fill-rule="evenodd"
              d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
              clip-rule="evenodd"
            />
          </svg>
          <p class="text-xl text-current text-center">Fristenkalender</p>
        </div>
      </a>
      <p class="text-sm text-justify pt-4 px-40">
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      </p>
    </div>
  {/if}
</div>
