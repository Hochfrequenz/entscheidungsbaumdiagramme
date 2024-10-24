<script>
  import "../app.scss";

  import { Footer } from "$lib";
</script>

<div class="flex flex-col h-screen">
  <main class="flex-grow flex flex-col overflow-hidden">
    <slot />
  </main>
  <Footer />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
