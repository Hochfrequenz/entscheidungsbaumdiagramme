<script lang="ts">
  import "$src/app.scss";

  import { FooterTools } from "$lib/components";
</script>

<div class="flex flex-col flex-1">
  <div class="flex-1 flex flex-col">
    <slot />
  </div>
  <FooterTools />
</div>
