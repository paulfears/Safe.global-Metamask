import {
  Web3TransactionOptions,
  Web3TransactionResult
} from '../../types'
import { toTxResult } from '../../utils'
import { SignMessageLibContract } from '@safe-global/safe-core-sdk-types'

abstract class SignMessageLibWeb3Contract implements SignMessageLibContract {
  constructor(public contract) {}

  getAddress(): string {
    return this.contract.options.address
  }

  async signMessage(
    data: string,
    options?: Web3TransactionOptions
  ): Promise<Web3TransactionResult> {
    if (options && !options.gas) {
      options.gas = await this.estimateGas('signMessage', [data], { ...options })
    }
    const txResponse = this.contract.methods.signMessage(data).send(options)
    return toTxResult(txResponse, options)
  }

  async getMessageHash(message: string): Promise<string> {
    return this.contract.methods.getMessageHash(message).call()
  }

  encode(methodName: string, params: any[]): string {
    return (this.contract as any).methods[methodName](...params).encodeABI()
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

export default SignMessageLibWeb3Contract
