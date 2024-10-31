<script lang="ts">
  import "../../../app.scss";

  import { page } from "$app/stores";
  import { EbdFormHeader } from "$lib";

  $: ({ formatVersions, ebds } = $page.data);
  $: params = $page.params.ebd?.split("/") || [];
  $: formatVersion = params[0];
  $: ebd = params[1];
</script>

<div class="flex flex-col h-full">
  <EbdFormHeader
    {formatVersions}
    {ebds}
    currentFormatVersion={formatVersion}
    currentEbd={ebd}
  />
  <div class="flex-grow overflow-hidden">
    <slot />
  </div>
</div>
