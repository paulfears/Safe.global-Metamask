import {
    KeyringAccount,
    KeyringRequest,
    KeyringSnapRpcClient,
  } from '@metamask/keyring-api';

  import { login } from './safeLogin';
export class MetamaskCaller{
    snapid:string
    client: KeyringSnapRpcClient
    provider
    constructor(snapId:string){
        console.log(snapId);
        this.snapid = snapId;
        console.log(this.snapid);
        this.provider = window.ethereum
        this.client = new KeyringSnapRpcClient(this.snapid, window.ethereum)
    }

    async connect(){
        console.log("this is");
        console.log(this);
        console.log("this.client is: ")
        console.log(this.client);
        console.log("this.snapid is: ");
        console.log(this.snapid);
        console.log("here");
        console.log("window is");
        console.log(window);
        console.log("window.ethereum is ");
        console.log(window.ethereum);
        console.log("snapid is");
        console.log(this.snapid);
        const result = await window.ethereum.request({
            method: 'wallet_requestSnaps',
            params: {
              [this.snapid]: {},
            },
          });
        
        login();
        return result;
    }

    async listAccounts(){
        console.log("in list accounts");
        const accounts = await this.client.listAccounts()
        console.log(accounts);
        return accounts;
    }

    async createAccount(name, options){
        console.log("in create Accounts");
        const account = await this.client.createAccount(name, options);
        console.log(account);
        return account;
    }



}