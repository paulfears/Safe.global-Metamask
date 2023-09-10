<script>
    import { slide } from 'svelte/transition';
    import { linear, sineInOut, elasticInOut, quadInOut, quintInOut } from 'svelte/easing';

    import {ethers} from 'ethers';
    import {SnapId, currentAddress, SafeAPIKit, SafeInfo, snapAddress} from '../store'
    import { Button, Modal, GradientButton } from 'flowbite-svelte';
    import { Label, Input } from 'flowbite-svelte';
    import {MetamaskCaller} from '../utils/MetamaskCaller'
    import SafeFunctions from './safeFunctions.svelte';
    //props
    export let safeAddress = ""
    let walletOpen = false;
    //setup
    let accountAdded = ($SafeInfo)[safeAddress].deligates.includes($snapAddress);
    
    const metamaskCaller = new MetamaskCaller($SnapId);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log("ethers signer is: ");
    console.log(signer);
    let defaultModal = false;
    let newAccountName = "";
    console.log("safe info is: ");
    console.log($SafeInfo);
    console.log("deligates is: ");
    console.log(($SafeInfo)[safeAddress].deligates)
    console.log("snap address");
    console.log($snapAddress);
    //functions
    async function addAsOwnerAccount(name, safeAddress){
        
        console.log("snap connected");
        const signerAddress = await window.ethereum.request({
          method: 'wallet_invokeSnap',
          params: {
              snapid: $SnapId,
              request: {
                method: 'getSignerAddress',
                params: {
                    safeAddress: safeAddress
                }
              }
          },
        });
        console.log("signer address is:");
        console.log(signerAddress);
        console.log(snapResult);
        const account = await metamaskCaller.createAccount(name, safeAddress, type);
        console.log(account)
    }
    async function proposeTxn(){

      const txn = {
        to:'0x7cDf4F57dA50a3bCC2F8b4a6B2E21FA776a6c020',
        data: '0x',
        value: 4000
      }
      const proposedTxn = await metamaskCaller.proposeTransaction(txn, safeAddress);
      console.log(proposedTxn);

    }
    async function addToMetamask(){
      const MetamaskAccount = await metamaskCaller.createAccount2(newAccountName, safeAddress, 'deligator');
      console.log(MetamaskAccount);
      return MetamaskAccount;
    }
    async function addAsDeligateAccount(){
        const signerAddress = await window.ethereum.request({
          method: 'wallet_invokeSnap',
          params: {
              snapId: $SnapId,
              request: {
                method: 'getSignerAddress',
              }
          },
        });
      console.log("signer address is: ");
      console.log(signerAddress);
      console.log("new accountName is: ");
      console.log(newAccountName);
      console.log("safeaddress is: ");
      console.log(safeAddress);
      const delegateConfig = {
        safeAddress: safeAddress, // Optional
        delegateAddress: signerAddress,
        delegatorAddress: $currentAddress[0],
        label:"Add Metamask Deligate",
        signer: signer
      }
      const deligateTXN = await $SafeAPIKit.addSafeDelegate(delegateConfig);
      console.log(deligateTXN);
      //const MetamaskAccount = await metamaskCaller.createAccount(newAccountName, safeAddress, 'deligator');
      const MetamaskAccount = await metamaskCaller.createAccount2(newAccountName, safeAddress, 'deligator');
      accountAdded = true;
    }
</script>

<li class="flex-1 px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
<div style="display:flex; flex-direction:column; justify-content:left; text-align:left;">
  <p>Safe Address:</p>
  <p>{safeAddress}</p>
</div>
<br/>
<br/>
<span style="display:flex; justify-content:left;" class="gap-3">
  <Button color="light" size='xs'  on:click={() => (walletOpen = !walletOpen)}>
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 256 256">
      <path fill="currentColor" d="M216 76H56a12 12 0 0 1 0-24h136a4 4 0 0 0 0-8H56a20 20 0 0 0-20 20v128a20 20 0 0 0 20 20h160a12 12 0 0 0 12-12V88a12 12 0 0 0-12-12Zm4 124a4 4 0 0 1-4 4H56a12 12 0 0 1-12-12V80a19.86 19.86 0 0 0 12 4h160a4 4 0 0 1 4 4Zm-32-60a8 8 0 1 1-8-8a8 8 0 0 1 8 8Z"/>
    </svg>
  </Button>

  {#if true}
  <Button color="light"  size='xs'  on:click={() => (defaultModal = true)}>
    <img alt="add" width="20" height="20" src="/add.svg">
    Metamask
  </Button>
  {/if}
  {#if accountAdded}
  <Button color="light" disabled size='xs'>
    Added To Metamask
  </Button>
  {/if}
</span>
{#if walletOpen}
  <br/>
  <br/>
  <span transition:slide={{ delay: 0, duration: 300, easing: quintInOut, axis: 'y' }}>
    <SafeFunctions accountAdded={accountAdded} safeAddress={safeAddress}/>
  </span>
{/if}

</li>
        


<Modal title="CreateAccount" bind:open={defaultModal} autoclose>
  <Label class="block mb-2">Account Nasme</Label>
  <Input label="Email" bind:value={newAccountName} required placeholder="Safe Account 1" />
  
    <Button on:click={addAsDeligateAccount}>Add account As deligate</Button>
    <Button on:click={addToMetamask}>add To Metamask Test Button</Button>
</Modal>