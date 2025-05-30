<script lang="ts">
  import "$src/app.scss";

  import { onMount } from "svelte";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { Footer } from "$lib/components";
  import auth from "$src/auth/authService";
  import { isAuthenticated } from "$src/store";

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

    isAuthenticated.subscribe((value: boolean) => {
      if (!value && !isLoading && $page.url.pathname !== `${base}/`) {
        goto(`${base}/`);
      }
    });
  });

  $: if (!$isAuthenticated && !isLoading && $page.url.pathname !== `${base}/`) {
    goto(`${base}/`);
  }

  $: isEbdRoute = $page.url.pathname.startsWith(`${base}/ebd`);
</script>

{#if isLoading}
  <div class="flex items-center justify-center h-screen">
    <p>Loading...</p>
  </div>
{:else}
  <div
    class="flex flex-col"
    class:min-h-screen={!isEbdRoute}
    class:h-screen={isEbdRoute}
  >
    <main class="flex-grow flex flex-col" class:overflow-hidden={isEbdRoute}>
      <slot />
    </main>
    {#if !isEbdRoute}
      <Footer />
    {/if}
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: "Roboto", sans-serif;
  }
</style>
