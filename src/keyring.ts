/* eslint-disable no-restricted-globals */

import { JsonTx } from '@ethereumjs/tx';
import { ethers } from 'ethers';
import {
  Keyring,
  KeyringAccount,
  KeyringRequest,
  SubmitRequestResponse,
} from '@metamask/keyring-api';
import type { Json, JsonRpcRequest } from '@metamask/utils';
import { v4 as uuid } from 'uuid';
import { jsonTx_to_safeTransaction } from './util';
import {
  isEvmChain,
} from './util';
import { AccountManager } from './AccountManager';

export type KeyringState = {
  wallets: Record<string, Wallet>;
  requests: Record<string, KeyringRequest>;
};

export type Wallet = {
  account: KeyringAccount;
  salt: String;
};

export class SafeKeyring implements Keyring {
  
  constructor() {
    
  }

  async getAccount(id:string): Promise<KeyringAccount>{
    console.log("getAccount called");
    const keyRings = await AccountManager.loadKeyrings();
    for(let i = 0; i<keyRings.length; i++){
      if(keyRings[i].id === id){
        return keyRings[i]
      }
    }
    throw new Error(`Account ${id} not found`);
  }
  async listAccounts(): Promise<KeyringAccount[]> {
    console.log("list accounts")
    const accounts = await AccountManager.loadKeyrings()
    console.log(accounts);
    return accounts;
  }



  async createAccount(name:string, options: Record<string, Json> | null = null): Promise<KeyringAccount> 
  {
    console.log("inside create Account");
    if(!options.safeAddress){
      throw new Error(`Must specify Safe Address`)
    }
    if(!options.type){
      throw new Error('must specify account type');
    }
    console.log(options);
    
    return AccountManager.addAccount((options.safeAddress as string), name, (options.type as string));
  }

  async filterAccountChains(_id: string, chains: string[]): Promise<string[]> {
    // The `id` argument is not used because all accounts created by this snap
    // are expected to be compatible with any EVM chain.
    return chains.filter((chain) => isEvmChain(chain));
  }

  async updateAccount(account: KeyringAccount): Promise<void> {
    

    await snap.request({
      method: 'snap_manageAccounts',
      params: {
        method: 'updateAccount',
        params: { account },
      },
    });
  }

  async deleteAccount(id: string): Promise<void> {
    console.log("in delete account");
    await snap.request({
      method: 'snap_manageAccounts',
      params: {
        method: 'deleteAccount',
        params: { id },
      },
    });
  }

  async listRequests(): Promise<KeyringRequest[]> {
    console.log("list requests");
    throw new Error("not implemented yet");
    //return Object.values();
  }

  async getRequest(id: string): Promise<KeyringRequest> {
    console.log("get Requests");
    throw new Error("not implemented yet");
    //return this.#requests[id];
  }

  // This snap implements a synchronous keyring, which means that the request
  // doesn't need to be approved and the execution result will be returned to
  // the caller by the `submitRequest` method.
  //
  // In an asynchronous implementation, the request should be stored in queue
  // of pending requests to be approved or rejected by the user.
  async submitRequest(request: KeyringRequest): Promise<SubmitRequestResponse> {
    const { method, params = '' } = request.request as JsonRpcRequest;
    console.log("submitRequest called!");
    console.log(request);
    console.log(method);
    if(method === 'eth_sendTransaction'){
      const result:Json = await this.handleEthSendTransaction(params);
      console.log("successfully returned here");
      console.log(result);
      const output:SubmitRequestResponse = {
        pending: false,
        result
      }
      return output
    }
    const signature = await this.handleSigningRequest(method, params);
    return {
      pending: false,
      result: signature,
    };
  }

  async approveRequest(_id: string): Promise<void> {
    throw new Error(
      'The "approveRequest" method is not available on this snap.',
    );
  }

  async rejectRequest(_id: string): Promise<void> {
    throw new Error(
      'The "rejectRequest" method is not available on this snap.',
    );
  }

  async handleEthSendTransaction(params): Promise<Json>{
    console.log("in eth_SendTransaction");
    let [from, tx, opts] = params as [string, any, Json];
    tx = jsonTx_to_safeTransaction(tx);
    from = ethers.utils.getAddress(from);
    console.log("method is: ");
    console.log("eth_sendTransaction");
    console.log("params is: ");
    console.log(params);
    console.log("tx is --------------")
    console.log(tx);
    const safeWallet = await AccountManager.getSafeWalletByAddress(from);
    console.log("got safe wallet");
    console.log(safeWallet);
    let txhash = await safeWallet.handleProposeTransaction(tx);
    console.log("final tx hash is");
    console.log(txhash);
    console.log(typeof txhash);
    return {"hash":txhash as string};
  }


  async handleSigningRequest(method: string, params: Json): Promise<Json | string> {
    switch (method) {
      case 'personal_sign': {
        const [from, message] = params as string[];
        throw new Error("not implemented yet");
        //return this.#signPersonalMessage(from, message);
      }
      case 'eth_signTransaction':
      {
        console.log("in eth_signTransaction")
        const [from, tx, opts] = params as [string, JsonTx, Json];
        console.log("here");
        console.log(from);
        console.log(tx);
        for(let key in tx){
          console.log(key);
          console.log(tx[key]);
        }
        console.log(opts);

        return {'hello':null} as Json;
        //return this.#signTransaction(from, tx, opts);
      }

      case 'eth_signTypedData':
      case 'eth_signTypedData_v1':
      case 'eth_signTypedData_v2':
      case 'eth_signTypedData_v3':
      case 'eth_signTypedData_v4': {
        /*
        const [from, data, opts] = params as [
          string,
          Json,
          { version: SignTypedDataVersion },
        ];
        return this.#signTypedData(from, data, opts);
        */
      }

      case 'eth_sign': {
        const [from, data] = params as [string, string];
        
        
      }

      default: {
        throw new Error(`EVM method not supported: ${method}`);
      }
    }
  }

  /*
  #signTransaction(from: string, tx: any, _opts: any): Json {
    // Patch the transaction to make sure that the `chainId` is a hex string.
    if (!tx.chainId.startsWith('0x')) {
      tx.chainId = `0x${parseInt(tx.chainId, 10).toString(16)}`;
    }

    const wallet = this.#getWalletByAddress(from);
    const privateKey = Buffer.from(wallet.privateKey, 'hex');
    const common = Common.custom(
      { chainId: tx.chainId },
      {
        hardfork:
          tx.maxPriorityFeePerGas || tx.maxFeePerGas
            ? Hardfork.London
            : Hardfork.Istanbul,
      },
    );

    const signedTx = TransactionFactory.fromTxData(tx, {
      common,
    }).sign(privateKey);

    return serializeTransaction(signedTx.toJSON(), signedTx.type);
  }

  #signTypedData(
    from: string,
    data: Json,
    opts: { version: SignTypedDataVersion } = {
      version: SignTypedDataVersion.V1,
    },
  ): string {
    const { privateKey } = this.#getWalletByAddress(from);
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');

    return signTypedData({
      privateKey: privateKeyBuffer,
      data: data as unknown as TypedDataV1 | TypedMessage<any>,
      version: opts.version,
    });
  }

  #signPersonalMessage(from: string, request: string): string {
    const { privateKey } = this.#getWalletByAddress(from);
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    const messageBuffer = Buffer.from(request.slice(2), 'hex');

    const signature = personalSign({
      privateKey: privateKeyBuffer,
      data: messageBuffer,
    });

    const recoveredAddress = recoverPersonalSignature({
      data: messageBuffer,
      signature,
    });
    if (recoveredAddress !== from) {
      throw new Error(
        `Signature verification failed for account "${from}" (got "${recoveredAddress}")`,
      );
    }

    return signature;
  }

  #signMessage(from: string, data: string): string {
    const { privateKey } = this.#getWalletByAddress(from);
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    const message = stripHexPrefix(data);
    const signature = ecsign(Buffer.from(message, 'hex'), privateKeyBuffer);
    return concatSig(toBuffer(signature.v), signature.r, signature.s);
  }
  */

  
}
