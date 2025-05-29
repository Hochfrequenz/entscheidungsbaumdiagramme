<script lang="ts">
  import "$src/app.scss";

  import { Footer, FooterTools } from "$lib/components";
</script>

<div class="flex flex-col h-full">
  <div class="flex-1 flex flex-col overflow-hidden">
    <slot />
  </div>
  <FooterTools />
  <Footer />
</div>
