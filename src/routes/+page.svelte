<script lang="ts">
  import "$src/app.scss";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import {
    AuthButton,
    IconSquareArrow,
    LandingpageBanner,
  } from "$lib/components";
  import auth from "$src/auth/authService";
  import { isAuthenticated } from "$src/store";

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
    <AuthButton />
  </div>
</div>

<section class="bg-primary flex-grow flex items-center justify-center">
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
        class="flex flex-row items-center gap-2 rounded-full bg-primary text-white px-5 py-2 shadow-md no-underline transition-transform duration-300 ease-in-out hover:scale-110"
      >
        <IconSquareArrow /> Jetzt öffnen
      </button>
    </div>
  </div>
</section>
<section class="pb-8">
  <LandingpageBanner />
</section>
