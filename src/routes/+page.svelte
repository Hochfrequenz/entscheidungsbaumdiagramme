<script lang="ts">
  import "../app.scss";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { LoginButton, ToolsBanner } from "$lib";

  import auth from "../auth/authService";
  import { isAuthenticated } from "../store";

  async function checkAuthentication() {
    if ($isAuthenticated) {
      goto(`${base}/ebd`);
    } else {
      await auth.loginWithRedirect();
    }
  }
</script>

<div class="relative">
  <div class="absolute top-4 right-4 z-10">
    <LoginButton />
  </div>
</div>

<section class="bg-secondary flex-grow flex items-center justify-center">
  <div class="rounded-lg bg-tint p-12 shadow-md">
    <h1 class="text-2xl pb-5">Entscheidungsbaumdiagramme</h1>
    <h2
      class="flex justify-center text-sm border-b border-secondary pb-3 mb-5 uppercase"
    >
      - aber es sind actually Diagramme.
    </h2>
    <div class="mt-10 flex justify-center">
      <button
        on:click={checkAuthentication}
        class="rounded-full bg-secondary text-white px-5 py-2 shadow-md inline-block no-underline transition-transform duration-300 ease-in-out hover:scale-110"
      >
        Jetzt öffnen
      </button>
    </div>
  </div>
</section>
<section class="pb-8">
  <ToolsBanner />
</section>
