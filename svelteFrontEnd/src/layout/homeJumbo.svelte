
<script>
    import ConnectButton from "../components/connectButton.svelte";
    import { connected} from "../store"
    
</script>
<section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
        <div style="display:flex; justify-content:center;">
        <h1 class="mb-4 text-4xl tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Origami</h1>
        <img height="100" width="100" src="/logo.svg"/>
        </div>
        <h2 class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">Manage Your Safe.global wallet in Metamask</h2>
        <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            {#if !$connected}
            <ConnectButton/>
            {/if}
        </div>
    </div>
</section>
