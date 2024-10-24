<script lang="ts">
  import "../../../../app.scss";

  import { page } from "$app/stores";
  import { EbdFormHeader } from "$lib";

  $: ({ formatVersions, ebds } = $page.data);
  $: ({ formatVersion, ebd } = $page.params);
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
