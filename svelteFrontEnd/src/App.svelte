<script lang="ts">
  import ConnectButton from './components/connectButton.svelte';
  import HomeJumbo from './layout/homeJumbo.svelte';
  import AppCard from './layout/AppCard.svelte';
  import { connected, currentAddress } from './store';
  window.ethereum.on('accountsChanged', function (accounts:string[]) {
    $currentAddress = accounts
  })
</script>

<main>
  <HomeJumbo/>
  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
      {#if $connected}
        <AppCard/>
      {/if}
    </div>
  </section>

</main>

