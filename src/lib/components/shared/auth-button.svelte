<script lang="ts">
  import { onMount } from "svelte";

  import { IconLogout } from "$lib/components";
  import auth from "$src/auth/authService";
  import { isAuthenticated } from "$src/store";

  export let background = "bg-secondary";
  export let textColor = "text-black/70";

  onMount(async () => {
    if (
      window.location.search.includes("code=") ||
      window.location.search.includes("state=")
    ) {
      await auth.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    await auth.checkAuth();
  });

  async function logout() {
    await auth.logout();
  }
</script>

<div class="flex items-center gap-4">
  {#if $isAuthenticated}
    <button
      on:click={logout}
      class="
        flex
        items-center
        gap-2
        rounded-full
        {background}
        {textColor}
        text-[16px]
        py-3
        px-5
        ring-1
        ring-black/5"
    >
      Ausloggen <IconLogout />
    </button>
  {/if}
</div>
