import { BigNumber } from '@ethersproject/bignumber'
import {
  Web3TransactionOptions,
  Web3TransactionResult
} from '../../types'
import { toTxResult } from '../../utils'
import {
  SafeSetupConfig,
  SafeTransaction,
  SafeTransactionData,
  SafeVersion
} from '@safe-global/safe-core-sdk-types'

abstract class SafeContractWeb3{
  constructor(public contract){}

  abstract setup(
    setupConfig: SafeSetupConfig,
    options?: Web3TransactionOptions
  ): Promise<Web3TransactionResult>

  async getVersion(): Promise<SafeVersion> {
    return (await this.contract.methods.VERSION().call()) as SafeVersion
  }

  getAddress(): string {
    return this.contract.options.address
  }

  async getNonce(): Promise<number> {
    return Number(await this.contract.methods.nonce().call())
  }

  async getThreshold(): Promise<number> {
    return Number(await this.contract.methods.getThreshold().call())
  }

  async getOwners(): Promise<string[]> {
    return this.contract.methods.getOwners().call()
  }

  async isOwner(address: string): Promise<boolean> {
    return this.contract.methods.isOwner(address).call()
  }

  async getTransactionHash(safeTransactionData: SafeTransactionData): Promise<string> {
    console.log("inside get Transaction hash");
    console.log(this.contract);
    console.log(this.contract.methods);
    for(let key in this.contract.methods){
      console.log(key);
      console.log(this.contract.methods[key]);
    }
    console.log(this.contract.methods.getTransactionHash);
    const aboutToCall = this.contract.methods
      .getTransactionHash(
        safeTransactionData.to,
        safeTransactionData.value,
        safeTransactionData.data,
        safeTransactionData.operation,
        safeTransactionData.safeTxGas,
        safeTransactionData.baseGas,
        safeTransactionData.gasPrice,
        safeTransactionData.gasToken,
        safeTransactionData.refundReceiver,
        safeTransactionData.nonce
      )
    console.log("about to call is");
    console.log(aboutToCall);
    return aboutToCall.call()
      
  }

  async approvedHashes(ownerAddress: string, hash: string): Promise<BigNumber> {
    return BigNumber.from(await this.contract.methods.approvedHashes(ownerAddress, hash).call())
  }

  async approveHash(
    hash: string,
    options?: Web3TransactionOptions
  ): Promise<Web3TransactionResult> {
    if (options && !options.gas) {
      options.gas = await this.estimateGas('approveHash', [hash], { ...options })
    }
    const txResponse = this.contract.methods.approveHash(hash).send(options)
    return toTxResult(txResponse, options)
  }

  abstract getModules(): Promise<string[]>

  abstract isModuleEnabled(moduleAddress: string): Promise<boolean>

  async isValidTransaction(
    safeTransaction: SafeTransaction,
    options?: Web3TransactionOptions
  ): Promise<boolean> {
    let isTxValid = false
    try {
      if (options && !options.gas) {
        options.gas = await this.estimateGas(
          'execTransaction',
          [
            safeTransaction.data.to,
            safeTransaction.data.value,
            safeTransaction.data.data,
            safeTransaction.data.operation,
            safeTransaction.data.safeTxGas,
            safeTransaction.data.baseGas,
            safeTransaction.data.gasPrice,
            safeTransaction.data.gasToken,
            safeTransaction.data.refundReceiver,
            safeTransaction.encodedSignatures()
          ],
          {
            ...options
          }
        )
      }
      isTxValid = await this.contract.methods
        .execTransaction(
          safeTransaction.data.to,
          safeTransaction.data.value,
          safeTransaction.data.data,
          safeTransaction.data.operation,
          safeTransaction.data.safeTxGas,
          safeTransaction.data.baseGas,
          safeTransaction.data.gasPrice,
          safeTransaction.data.gasToken,
          safeTransaction.data.refundReceiver,
          safeTransaction.encodedSignatures()
        )
        .call(options)
    } catch {}
    return isTxValid
  }

  async execTransaction(
    safeTransaction: SafeTransaction,
    options?: Web3TransactionOptions
  ): Promise<Web3TransactionResult> {
    if (options && !options.gas) {
      options.gas = await this.estimateGas(
        'execTransaction',
        [
          safeTransaction.data.to,
          safeTransaction.data.value,
          safeTransaction.data.data,
          safeTransaction.data.operation,
          safeTransaction.data.safeTxGas,
          safeTransaction.data.baseGas,
          safeTransaction.data.gasPrice,
          safeTransaction.data.gasToken,
          safeTransaction.data.refundReceiver,
          safeTransaction.encodedSignatures()
        ],
        {
          ...options
        }
      )
    }
    const txResponse = this.contract.methods
      .execTransaction(
        safeTransaction.data.to,
        safeTransaction.data.value,
        safeTransaction.data.data,
        safeTransaction.data.operation,
        safeTransaction.data.safeTxGas,
        safeTransaction.data.baseGas,
        safeTransaction.data.gasPrice,
        safeTransaction.data.gasToken,
        safeTransaction.data.refundReceiver,
        safeTransaction.encodedSignatures()
      )
      .send(options)

    return toTxResult(txResponse, options)
  }

  encode(methodName: string, params: any[]): string {
    return (this.contract.methods as any)[methodName](...params).encodeABI()
  }

  async estimateGas(
    methodName: string,
    params: any[],
    options: Web3TransactionOptions
  ): Promise<string> {
    return (
      await (this.contract.methods as any)[methodName](...params).estimateGas(options)
    ).toString()
  }
}

export default SafeContractWeb3
