<script lang="ts">
  import { base } from "$app/paths";

  export let width = "34";
  export let height = "34";
  export let stroke = "rgb(0 0 0 / 0.7)";
</script>

<img
  src="{base}/companystylesheet/icons/growing_plant.svg"
  alt="Pflanze"
  {width}
  {height}
  style="stroke: {stroke}"
/>
