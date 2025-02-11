<script lang="ts">
  import { base } from "$app/paths";

  export let width = "18";
  export let height = "18";
  export let stroke = "rgb(0 0 0 / 0.7)";
</script>

<img
  src="{base}/companystylesheet/icons/filter.svg"
  alt="Filter"
  {width}
  {height}
  style="stroke: {stroke}"
/>
