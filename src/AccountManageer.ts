
import { Json } from "@metamask/snaps-types";
import { v4 as uuid } from 'uuid';
import { KeyringAccount } from "@metamask/keyring-api";
export interface DataWallet{
    type: 'deligate' | 'creator' | 'owner' | 'observer',
    name: string,
    id: string,
    safeAddress: string,
}

interface stateStructure{
    keyRingWallets: KeyringAccount[],
    dataWallets: {[key:string]:DataWallet}
}

export type LoadedAccounts = {[key: string]: (DataWallet|Json)} 

export class AccountManager{
    static state:stateStructure = {keyRingWallets:[], dataWallets:{}}
    static loaded:boolean = false;

    static async addAccount(safeAddress:string, name:string, type:'deligate' | 'creator' | 'owner' | 'observer'){
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
            safeAddress: safeAddress
        }
        
        const keyRing: KeyringAccount = {
            id: uuid(),
            options: {},
            address: safeAddress,
            methods: [
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
        let state = await snap.request({
            method: 'snap_manageState',
            params: { operation: 'get' },
        });
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
        AccountManager.state = state as unknown as stateStructure;
        AccountManager.loaded = true;
        return AccountManager.state;
        
    }
    static async saveState(state:stateStructure){
        await snap.request({
          method: 'snap_manageState',
          params: { operation: 'update', newState: state as unknown as Record<string,Json> },
        });
        AccountManager.state = state;
    }
    static async clearState(){
        await snap.request({
            method: 'snap_manageState',
            params: { operation: 'clear' },
        });
    }
}