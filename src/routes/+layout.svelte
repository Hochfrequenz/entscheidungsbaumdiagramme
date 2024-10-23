<script lang="ts">
  import "../app.scss";

  import { onMount } from "svelte";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { Footer } from "$lib";

  import auth from "../auth/authService";
  import { isAuthenticated } from "../store";

  let isLoading = true;

  onMount(async () => {
    await auth.createClient();

    if (
      window.location.search.includes("code=") ||
      window.location.search.includes("state=")
    ) {
      await auth.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    await auth.checkAuth();
    isLoading = false;

    isAuthenticated.subscribe((value) => {
      if (!value && !isLoading && $page.url.pathname !== `${base}/`) {
        goto(`${base}/`);
      }
    });
  });

  $: if (!$isAuthenticated && !isLoading && $page.url.pathname !== `${base}/`) {
    goto(`${base}/`);
  }
</script>

{#if isLoading}
  <div class="flex items-center justify-center h-screen">
    <p>Loading...</p>
  </div>
{:else}
  <div class="flex flex-col h-screen">
    <main class="flex-grow flex flex-col overflow-hidden">
      <slot />
    </main>
    <Footer />
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
