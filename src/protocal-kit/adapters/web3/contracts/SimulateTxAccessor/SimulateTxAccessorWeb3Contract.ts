
import { SimulateTxAccessorContract } from '@safe-global/safe-core-sdk-types'

abstract class SimulateTxAccessorWeb3Contract implements SimulateTxAccessorContract {
  constructor(public contract) {}

  getAddress(): string {
    return this.contract.options.address
  }

  encode(methodName: string, params: any[]): string {
    return (this.contract as any).methods[methodName](...params).encodeABI()
  }
}

export default SimulateTxAccessorWeb3Contract
