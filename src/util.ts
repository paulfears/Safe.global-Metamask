
import type { Json } from '@metamask/utils';

import { Wallet } from './keyring';


import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
import { JsonTx } from '@ethereumjs/tx';
import { ethers } from 'ethers';


export function jsonTx_to_safeTransaction(tx:JsonTx):SafeTransactionDataPartial{
  tx.value = BigInt(tx.value).toString(10);
  tx.to = ethers.utils.getAddress(tx.to);
  tx.nonce = undefined;
  return tx as unknown as SafeTransactionDataPartial;


}
/**
 * Determines whether the given CAIP-2 chain ID represents an EVM-based chain.
 *
 * @param caip2ChainId - The CAIP-2 chain ID to check.
 * @returns Returns true if the chain is EVM-based, otherwise false.
 */
export function isEvmChain(caip2ChainId: string): boolean {
  return caip2ChainId.startsWith('eip155:');
}
