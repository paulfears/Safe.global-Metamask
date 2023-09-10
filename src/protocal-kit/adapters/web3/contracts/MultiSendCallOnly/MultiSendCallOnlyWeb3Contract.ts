
import { MultiSendCallOnlyContract } from '@safe-global/safe-core-sdk-types'

abstract class MultiSendCallOnlyWeb3Contract implements MultiSendCallOnlyContract {
  constructor(public contract) {}

  getAddress(): string {
    return this.contract.options.address
  }

  encode(methodName: string, params: any[]): string {
    return (this.contract as any).methods[methodName](...params).encodeABI()
  }
}

export default MultiSendCallOnlyWeb3Contract
