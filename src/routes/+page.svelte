<script lang="ts">
  import HanziExercise from "$lib/components/HanziExercise.svelte";
  import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>
<div class="container">
  <h1>Mandaroon</h1>
  <HanziExercise dataset={data.dataset}/>
</div>

<style>
  .container {
    background-color: #faedcd;
    max-width: 98vw;
    width: 720px;
    padding: 10px;
    margin: 10px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>