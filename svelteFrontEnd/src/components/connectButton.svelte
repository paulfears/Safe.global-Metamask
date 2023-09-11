<script>
    import { GradientButton } from 'flowbite-svelte';
    import {Web3} from 'web3';
    import SafeApiKit from '@safe-global/api-kit';
    import { Web3Adapter } from '@safe-global/protocol-kit'
    import {connected, currentAddress, Safes, SafeInfo, SafeAPIKit, SnapId, snapAddress} from '../store'
    import {snapId} from '../constants'
    import {MetamaskCaller} from '../utils/MetamaskCaller'
    
    const metamaskCaller = new MetamaskCaller(snapId);

    async function switchToTestnet(){
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x5' }],
            });
            } catch (switchError) {
            if (switchError.code === 4902) {
                // You can make a request to add the chain to wallet here
                console.log('Testnet Chain hasn\'t been added to the wallet!')
            }
        }
    }
    async function connect(){
        window.web3 = new Web3(window.ethereum);
        let accounts = await window.ethereum.enable();
        console.log(accounts);
        for(let i = 0; i< accounts.length; i++){
            accounts[i] = window.web3.utils.toChecksumAddress(accounts[i]);
        }
        console.log(accounts);
        $currentAddress = accounts;
        await switchToTestnet();
        const snapResult = await metamaskCaller.connectSnap();
        console.log(accounts);
        const ethAdapter = new Web3Adapter({
            web3: window.web3,
            signerAddress: accounts[0]
        })
        
        const safeApiKit = new SafeApiKit({
            txServiceUrl: 'https://safe-transaction-goerli.safe.global',
            ethAdapter
        })
        SafeAPIKit.set(safeApiKit);
        $Safes = await safeApiKit.getSafesByOwner(accounts[0]);
        console.log($Safes);
        let info = {}
        for(let safeAddr of $Safes.safes){
            info[safeAddr] = await safeApiKit.getSafeInfo(safeAddr)
            info[safeAddr]['deligates'] = Array.from((await safeApiKit.getSafeDelegates({safeAddress:safeAddr})).results.map((item)=>item.delegate));
        }
        $SafeInfo = info;
        const signerAddress = await window.ethereum.request({
          method: 'wallet_invokeSnap',
          params: {
              snapId: snapId,
              request: {
                method: 'getSignerAddress',
              }
          },
        });
        snapAddress.set(signerAddress);
        console.log(info);
        $connected = true;
    }
</script>

<GradientButton on:click={connect} color="purpleToPink">Connect</GradientButton>