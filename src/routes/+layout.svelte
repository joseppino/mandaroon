<script>
  import { Toaster } from "svelte-french-toast";
  import "../style/global.css";

  let { children } = $props();
  
</script>

<Toaster />
{@render children()}