<script>
    import { Card, Button } from 'flowbite-svelte';
    import { A } from 'flowbite-svelte';
    import {Safes} from '../store';
    import safeUI from '../components/safeUI.svelte'
    import SafeUi from '../components/safeUI.svelte';
    
</script>
<h2>Safes</h2>
<div style="display:flex; justify-content:center;">

<ul class="flex-1 max-w-xl text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
    {#each $Safes.safes as addr}
        <SafeUi safeAddress={addr}/>
    {/each}
    {#if $Safes.safes.length === 0}
    <ul>
        <li>looks like you don't have any safes yet</li>
        <br/>
        <li>create one at <A href="https://safe.global">safe.global</A></li>
    </ul>
    {/if}
</ul>
</div>
