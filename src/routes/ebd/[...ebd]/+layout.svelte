<script lang="ts">
  import "$src/app.scss";

  import { page } from "$app/stores";
  import { EbdFormHeader } from "$lib/components";

  $: ({ formatVersions, ebds } = $page.data);
  $: params = $page.params.ebd?.split("/") || [];
  $: formatVersion = params[0];
  $: ebdKey = params[1];
</script>

<div class="flex flex-col h-full">
  <EbdFormHeader
    {formatVersions}
    {ebds}
    currentFormatVersion={formatVersion}
    currentEbd={ebdKey}
  />
  <div class="flex-grow overflow-hidden">
    <slot />
  </div>
</div>
