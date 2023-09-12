import {
  MethodNotSupportedError,
  buildHandlersChain,
  handleKeyringRequest,
} from '@metamask/keyring-api';
import type { JsonRpcRequest, OnRpcRequestHandler } from '@metamask/snaps-types';
import { JsonStruct } from '@metamask/utils';
import { panel, heading, text } from '@metamask/snaps-ui';
import { AccountManager } from './AccountManageer';
import { SimpleKeyring } from './keyring';
import { InternalMethod, PERMISSIONS } from './permissions';
import { getState } from './stateManagement';
import { logRequest } from './util';
import { Wallet } from './WalletEthers';

let keyring: SimpleKeyring;

const walletapi = new Wallet();

/**
 * Log the requests.
 *
 * @param args - Request arguments.
 * @param args.origin - Caller origin.
 * @param args.request - Request to execute.
 * @returns Nothing, always throws `MethodNotSupportedError`.
 */
const loggerHandler: OnRpcRequestHandler = async ({ origin, request }) => {
  console.log(
    `[Snap] request (id=${request.id ?? 'null'}, origin=${origin}):`,
    request,
  );
  throw new MethodNotSupportedError(request.method);
};

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
    const keyringState = await getState();
    if (!keyring) {
      keyring = new SimpleKeyring(keyringState);
    }
  }
  console.log(keyring);

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
    AccountManager.clearState();
  }
  switch (request.method) {
    // internal methods
    
    case "getSignerAddress": {
      return (await walletapi.getAccount()).address
    }

    case "proposeTxn":{
      const safeAddress = params.safeAddress;
      console.log("inside proposeTxn");
      console.log(params);
      console.log(params.txn);
      const txn = params.txn;
      await walletapi.init(safeAddress, "deligator");
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
  loggerHandler,
  keyringHandler,
  customHandler,
);
