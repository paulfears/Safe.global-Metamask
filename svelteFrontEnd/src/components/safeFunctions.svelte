<script lang="ts">
    import { Button, Listgroup, ListgroupItem, Tabs, TabItem, Modal, Input, Label} from "flowbite-svelte";
    import type {SafeMultisigTransactionListResponse} from '@safe-global/api-kit'
    import { SafeAPIKit, SafeInfo } from "../store";
    import {snapId} from '../constants'
    import {ethers} from 'ethers';
    import {MetamaskCaller} from '../utils/MetamaskCaller'
    //props
    export let safeAddress:string;
    export let accountAdded:boolean;
    //data
    let defaultModal = false;
    let pendingTxns = []
    let value = ""
    let data = ""
    let to_address = ""
    let safeInfo = $SafeInfo[safeAddress]
    console.log(safeInfo);
    //apis
    const metamaskCaller = new MetamaskCaller(snapId);
    //functions
    async function loadPendingTransactions(){
        const pendingTxs: SafeMultisigTransactionListResponse = await $SafeAPIKit.getPendingTransactions(safeAddress);
        console.log(pendingTxs);
        return pendingTxs;
    }
    async function handleLoadTransactions(){
        pendingTxns = (await loadPendingTransactions()).results
    }
    async function proposeTxn(){

        const txn = {
        to:to_address,
        data: '0x',
        value: ethers.utils.parseUnits(value,"ether").toString()
        }
        const proposedTxn = await metamaskCaller.proposeTransaction(txn, safeAddress);
        console.log(proposedTxn);

    }
</script>



<Tabs>
    <TabItem open>
        <span slot="title">Functions</span>
        <Button color="light"  size='xs'  on:click={()=>defaultModal=true}>
            <img alt="add" width="20" height="20" src="/add.svg">
            propose Transaction
        </Button>
    </TabItem>
    <TabItem on:click={handleLoadTransactions}>
    <span slot="title">Transactions</span>
    <div>
        <div class="flex gap-x-3 ">
            <p>Proposed Transactions</p>
            <Button size="xs" class="p-1" outline color="light" on:click={handleLoadTransactions}>
            <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M5 5h5v5H9V6.5c-2.35.97-4 3.29-4 6c0 3.58 2.91 6.5 6.5 6.5a6.5 6.5 0 0 0 6.5-6.5c0-3.08-2.14-5.66-5-6.33V5.14c3.42.7 6 3.72 6 7.36c0 4.13-3.36 7.5-7.5 7.5A7.5 7.5 0 0 1 4 12.5C4 9.72 5.5 7.3 7.74 6H5V5Z"/>
            </svg>
            </Button>
        </div>
        <br>
        <br>
        <div class="flex-col">
        {#if pendingTxns.length > 0}
            <Listgroup items={pendingTxns} let:item>
                <ListgroupItem style="text-align:left;">
                <p>to: {item.to}</p>
                <p>value: {ethers.utils.formatEther(item.value)}</p>
                <p>data: {item.data}</p>
                </ListgroupItem>
            </Listgroup>
        {:else}
            <p>no proposed Transactions</p>
        {/if}
        </div>
    </div>
    </TabItem>
    <TabItem>
        <span slot="title">Safe Info</span>
        <p>Threshold: {safeInfo.threshold}</p>
        <p>Owners:</p>
        <Listgroup items={safeInfo.owners} let:item>
            {item}
        </Listgroup>
        <p>Deligates</p>
        <Listgroup items={safeInfo.deligates} let:item>
            {item}
        </Listgroup>
        
        
    </TabItem>
</Tabs>

<Modal title="CreateAccount" bind:open={defaultModal} autoclose>
    {#if accountAdded}
    <Label class="block mb-2">Recipeient</Label>
    <Input bind:value={to_address} required />
    <Label class="block mb-2">Value (eth)</Label>
    <Input bind:value={value} required/>
    
    <Button on:click={proposeTxn}>Propose Transaction</Button>
    {:else}
    <p>You must add this safe to metamask before proposeing a transaction</p>
    {/if}
</Modal>