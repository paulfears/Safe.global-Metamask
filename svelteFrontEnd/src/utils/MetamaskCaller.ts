import {
    KeyringSnapRpcClient,
  } from '@metamask/keyring-api';


import { snapId } from '../constants';

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

    async connectSnap(){
        const result = await window.ethereum.request({
            method: 'wallet_requestSnaps',
            params: {
              [this.snapid]: {},
            },
          });
        return result;
    }

    async listAccounts(){
        console.log("in list accounts");
        const accounts = await this.client.listAccounts()
        console.log(accounts);
        return accounts;
    }

    async createAccount(name:string, safeAddress:string, type: 'deligator' | 'signer' | 'observer'){
        console.log("in create Accounts");
        const account = await this.client.createAccount({name, safeAddress, type});
        console.log(account);
        return account;
    }

    async getSignerAddress(){
      const result = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: snapId,
          request: {
            method: 'getSignerAddress',
          },
        },
      });
      return result;
    }

    async proposeTransaction(txn, safeAddress:string){
      console.log("txn is: ")
      console.log(txn);
      console.log(JSON.stringify(txn));
      console.log("safeAddress: ");
      console.log(safeAddress);
      const result = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: snapId,
          request: {
            method: 'proposeTxn',
            params:{
              safeAddress:safeAddress.toString(),
              txn:txn
            }
          },
        },
      });
    }

    async createAccount2(name:string, safeAddress:string, type: 'deligator' | 'signer' | 'observer'){
      console.log("inside create account 2");
      const result = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: snapId,
          request: {
            method: 'addSafeAccount',
            params:{
              name:name,
              safeAddress:safeAddress,
              type:type,
              clearState: true
            }
          },
        },
      });
      return result;
      
  }



}