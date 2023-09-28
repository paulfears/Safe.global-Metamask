
import { Json } from "@metamask/snaps-types";
import { v4 as uuid } from 'uuid';
import { KeyringAccount } from "@metamask/keyring-api";
import { ethers } from "ethers";
import { SafeWallet } from "./SafeWallet";
import {JsonBIP44CoinTypeNode} from '@metamask/key-tree';
import { DataWallet } from "./types";

interface stateStructure{
    keyRingWallets: KeyringAccount[],
    dataWallets: {[key:string]:DataWallet}
}

export type LoadedAccounts = {[key: string]: (DataWallet|Json)} 


const CHAINS = [
    'https://safe-transaction-arbitrum.safe.global/', 
    'https://safe-transaction-aurora.safe.global/',
    'https://safe-transaction-avalanche.safe.global/',
    'https://safe-transaction-base.safe.global/',
    'https://safe-transaction-base-testnet.safe.global/',
    'https://safe-transaction-bsc.safe.global/',
    'https://safe-transaction-bsc.safe.global/',
    'https://safe-transaction-celo.safe.global/',
    'https://safe-transaction-mainnet.safe.global/', //eth mainnet
    'https://safe-transaction-gnosis-chain.safe.global/',
    'https://safe-transaction-goerli.safe.global/',
    'https://safe-transaction-optimism.safe.global/',
    'https://safe-transaction-polygon.safe.global/',
]
    

export class AccountManager{
    static state:stateStructure = {keyRingWallets:[], dataWallets:{}}
    static loaded:boolean = false;

    static async runPreFlight(address:string):Promise<Boolean>{
        if(!AccountManager.loaded){
            await AccountManager.reFreshState()
        }
        else{
            console.log("account manager already loaded");
        }
        const account:DataWallet = AccountManager.state.dataWallets[address];
        if(account.runPreFlight === false){
            return true
        }
        if(account.type === 'deligator'){
            
        }
        if(account.type === 'owner'){

        }
        return true
    }
    static async getEthersWallet(): Promise<ethers.Wallet>{
        // By way of example, we will use Dogecoin, which has `coin_type` 3.
        const ethNode = (await snap.request({
            method: 'snap_getBip44Entropy',
            params: {
            coinType: 9001,
            
            },
        })) as JsonBIP44CoinTypeNode;
        
        const RPC_URL='https://eth-goerli.public.blastapi.io'
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
        const wallet = new ethers.Wallet(ethNode.privateKey, provider);
        return wallet;   
    }

    static async addAccount(safeAddress:string, name:string, type:'deligator' | 'creator' | 'owner' | 'observer'){
        console.log("in add Account");
        let accounts: LoadedAccounts
        if(!AccountManager.loaded){
            await AccountManager.reFreshState()
        }
        
        let state = AccountManager.state;
        console.log("ADDING ACCOUNT safeADDRESS is ------------------->");
        console.log(safeAddress);
        const id = uuid();
        state.dataWallets[safeAddress] = {
            id, 
            name:name,
            type: type,
            safeAddress: safeAddress,
            runPreFlight: true
        }
        const keyRing: KeyringAccount = {
            id: uuid(),
            name: name,
            options: {},
            address: safeAddress,
            supportedMethods: [
              'eth_sendTransaction',
              'eth_signTransaction',
              'eth_signTypedData_v1',
              'eth_signTypedData_v3',
              'eth_signTypedData_v4',
              'eth_signTypedData',
              'personal_sign',
            ],
            type: 'eip155:eoa',
          };
          console.log(keyRing);
          state.keyRingWallets.push(keyRing);

          await AccountManager.saveState(state);
          await snap.request({
            method: 'snap_manageAccounts',
            params: {
              method: 'createAccount',
              params: {keyRing} as Record<string, Json> ,
            },
          });
          console.log("manage accounts complete");
          return keyRing;
    }

    static async getSafeWalletByAddress(address:string, chainCode?:string):Promise<SafeWallet>{
        console.log("in getSafeWalletByAddress");
        console.log(`address is ${address}`);
        address = ethers.utils.getAddress(address);
        if(!AccountManager.loaded){
            await AccountManager.reFreshState()
        }
        console.log("state loaded");
        console.log(AccountManager.state);
        for(let address in AccountManager.state.dataWallets){
            console.log(address)
            console.log(AccountManager.state.dataWallets[address]);
        }
        
        if(!AccountManager.state.dataWallets[address]){
            throw new Error("account not found");
        }
        console.log("data Wallet is");
        console.log(AccountManager.state.dataWallets[address]);
        const dataWallet:DataWallet = AccountManager.state.dataWallets[address];
    

        const safeWallet = await SafeWallet.init(dataWallet);
        console.log("safe wallet is");
        console.log(safeWallet);
        return safeWallet;
    }

    static async loadAccounts():Promise<LoadedAccounts>{
        if(AccountManager.loaded){
            return AccountManager.state.dataWallets
        }
        return (await AccountManager.reFreshState()).dataWallets
    }

    static async loadKeyrings():Promise<KeyringAccount[]>{
        if(AccountManager.loaded){
            return AccountManager.state.keyRingWallets
        }
        return (await AccountManager.reFreshState()).keyRingWallets
    }

    static async reFreshState():Promise<stateStructure>{
        console.log("refresh state called");
        
        let state = await snap.request({
            method: 'snap_manageState',
            params: { operation: 'get' },
        });
        console.log("state loaded");
        if(state === null){
            console.log("state loaded as null");
            state = {
                keyRingWallets: [],
                dataWallets: {}
            }
        }
        else{
            console.log("state loaded non null");
            console.log(state);
        }
        console.log("about to set state");
        AccountManager.state = state as unknown as stateStructure;
        AccountManager.loaded = true;
        return AccountManager.state;
        
    }
    static async saveState(state:stateStructure){
        console.log("state updated");
        await snap.request({
          method: 'snap_manageState',
          params: { operation: 'update', newState: state as unknown as Record<string,Json> },
        });
        AccountManager.state = state;
    }
    static async clearState(){
        console.log("state is being cleared");
        await snap.request({
            method: 'snap_manageState',
            params: { operation: 'clear' },
        });
    }

}