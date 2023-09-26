
import { Json } from "@metamask/snaps-types";
import { v4 as uuid } from 'uuid';
import { KeyringAccount } from "@metamask/keyring-api";
import { ethers } from "ethers";
import { SafeWallet } from "./SafeWallet";

export interface DataWallet{
    type: 'deligator' | 'creator' | 'owner' | 'observer',
    name: string,
    id: string,
    safeAddress: string,
    runPreFlight: boolean
}

interface stateStructure{
    keyRingWallets: KeyringAccount[],
    dataWallets: {[key:string]:DataWallet}
}

export type LoadedAccounts = {[key: string]: (DataWallet|Json)} 

export class AccountManager{
    static state:stateStructure = {keyRingWallets:[], dataWallets:{}}
    static loaded:boolean = false;

    static async addAccount(safeAddress:string, name:string, type:'deligator' | 'creator' | 'owner' | 'observer'){
        console.log("in add Account");
        let accounts: LoadedAccounts
        if(!AccountManager.loaded){
            await AccountManager.reFreshState()
        }
        
        let state = AccountManager.state;
        
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

    static async getSafeWalletByAddress(address:string):Promise<SafeWallet>{
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
        const safeWallet = new SafeWallet();
        console.log("safe wallet is");
        console.log(safeWallet);
        await safeWallet.init(address, AccountManager.state.dataWallets[address].type)
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