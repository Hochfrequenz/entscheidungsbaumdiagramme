<script lang="ts">
  export let orientation: string = "rotate-0";
  export let id: string;
  export let size: string = "16px";
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 20.7 12.86"
  fill="none"
  stroke="white"
  stroke-width="2.5"
  stroke-linecap="round"
  stroke-miterlimit="10"
  {id}
  class={orientation}
  ><path d="M2 10.86L10.31 2" />
  <path d="M18.7 10.82L10.31 2.03" /></svg
>
