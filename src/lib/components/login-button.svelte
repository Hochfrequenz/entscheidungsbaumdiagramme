<script lang="ts">
  import { onMount } from "svelte";
  import auth from "../../auth/authService";
  import { isAuthenticated } from "../../store";
  import { IconLogin, IconLogout } from "$lib";

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

  async function login() {
    await auth.loginWithRedirect();
  }

  async function logout() {
    await auth.logout();
  }
</script>

{#if $isAuthenticated}
  <button
    on:click={logout}
    class="flex items-center gap-2 rounded-full bg-tint text-[16px] font-bold py-3 px-5 text-secondary"
  >
    Ausloggen <IconLogout />
  </button>
{:else}
  <button
    on:click={login}
    class="flex items-center gap-2 rounded-full bg-tint text-[16px] font-bold py-3 px-5 text-secondary"
  >
    Einloggen <IconLogin />
  </button>
{/if}
