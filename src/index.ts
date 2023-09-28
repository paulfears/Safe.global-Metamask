import {
  MethodNotSupportedError,
  buildHandlersChain,
  handleKeyringRequest,
} from '@metamask/keyring-api';
import type { JsonRpcRequest, OnRpcRequestHandler } from '@metamask/snaps-types';
import { AccountManager } from './AccountManager';
import { SafeKeyring } from './keyring';

let keyring: SafeKeyring;




/**
 * Handle keyring requests.
 *
 * @param args - Request arguments.
 * @param args.request - Request to execute.
 * @returns The execution result.
 */
const keyringHandler: OnRpcRequestHandler = async ({ request }) => {
  console.log(request);
  if (!keyring) {
    keyring = new SafeKeyring();
  }

  return await handleKeyringRequest(keyring, request);
};

/**
 * Execute a custom snap request.
 *
 * @param args - Request arguments.
 * @param args.request - Request to execute.
 * @returns The execution result.
 */
const customHandler: OnRpcRequestHandler = async ({
  request,
}): Promise<any> => {
  const params = request?.params;
  if(params?.clearState === true){
    console.log("clearing State");
    AccountManager.clearState();
  }
  switch (request.method) {
    // internal methods
    
    case "getSignerAddress": {
      return (await AccountManager.getEthersWallet()).address
    }

    case "proposeTxn":{
      const safeAddress = params.safeAddress;
      console.log("inside proposeTxn");
      console.log(params);
      console.log(params.txn);
      const txn = params.txn;
      const walletapi = await AccountManager.getSafeWalletByAddress(safeAddress);
      return await walletapi.handleProposeTransaction(txn);
      
    }
    

    case "addSafeAccount":{
      const safeAddress = params.safeAddress;
      const type = params.type;
      const name = params.name;
      console.log("name is: ");
      console.log(name);
      console.log("type is: ");
      console.log(type);
      console.log("safe address is: ");
      console.log(safeAddress);
      await AccountManager.addAccount(safeAddress, name, type);
      return true;
    }

    default: {
      throw new MethodNotSupportedError(request.method);
    }
  }
};

export const onRpcRequest: OnRpcRequestHandler = buildHandlersChain(
  customHandler,
  keyringHandler,
);
