import { SafeVersion } from '@safe-global/safe-core-sdk-types'
import CompatibilityFallbackHandler_V1_3_0_Web3 from './CompatibilityFallbackHandler/v1.3.0/CompatibilityFallbackHandler_V1_3_0_Web3'
import CompatibilityFallbackHandler_V1_4_1_Web3 from './CompatibilityFallbackHandler/v1.4.1/CompatibilityFallbackHandler_V1_4_1_Web3'
import CreateCallContract_V1_3_0_Web3 from './CreateCall/v1.3.0/CreateCallEthersContract_V1_3_0_Web3'
import CreateCallContract_V1_4_1_Web3 from './CreateCall/v1.4.1/CreateCallEthersContract_V1_4_1_Web3'
import MultiSendContract_V1_1_1_Web3 from './MultiSend/v1.1.1/MultiSendContract_V1_1_1_Web3'
import MultiSendContract_V1_3_0_Web3 from './MultiSend/v1.3.0/MultiSendContract_V1_3_0_Web3'
import MultiSendContract_V1_4_1_Web3 from './MultiSend/v1.4.1/MultiSendContract_V1_4_1_Web3'
import MultiSendCallOnlyContract_V1_3_0_Web3 from './MultiSendCallOnly/v1.3.0/MultiSendCallOnlyContract_V1_3_0_Web3'
import MultiSendCallOnlyContract_V1_4_1_Web3 from './MultiSendCallOnly/v1.4.1/MultiSendCallOnlyContract_V1_4_1_Web3'
import SafeContract_V1_0_0_Web3 from './Safe/v1.0.0/SafeContract_V1_0_0_Web3'
import SafeContract_V1_1_1_Web3 from './Safe/v1.1.1/SafeContract_V1_1_1_Web3'
import SafeContract_V1_2_0_Web3 from './Safe/v1.2.0/SafeContract_V1_2_0_Web3'
import SafeContract_V1_3_0_Web3 from './Safe/v1.3.0/SafeContract_V1_3_0_Web3'
import SafeContract_V1_4_1_Web3 from './Safe/v1.4.1/SafeContract_V1_4_1_Web3'
import SafeProxyFactoryContract_V1_0_0_Web3 from './SafeProxyFactory/v1.0.0/SafeProxyFactoryContract_V1_0_0_Web3'
import SafeProxyFactoryContract_V1_1_1_Web3 from './SafeProxyFactory/v1.1.1/SafeProxyFactoryContract_V1_1_1_Web3'
import SafeProxyFactoryContract_V1_3_0_Web3 from './SafeProxyFactory/v1.3.0/SafeProxyFactoryContract_V1_3_0_Web3'
import SafeProxyFactoryContract_V1_4_1_Web3 from './SafeProxyFactory/v1.4.1/SafeProxyFactoryContract_V1_4_1_Web3'
import SignMessageLibContract_V1_3_0_Web3 from './SignMessageLib/v1.3.0/SignMessageLibContract_V1_3_0_Web3'
import SignMessageLibContract_V1_4_1_Web3 from './SignMessageLib/v1.4.1/SignMessageLibContract_V1_4_1_Web3'
import SimulateTxAccessorContract_V1_3_0_Web3 from './SimulateTxAccessor/v1.3.0/SimulateTxAccessorContract_V1_3_0_Web3'
import SimulateTxAccessorContract_V1_4_1_Web3 from './SimulateTxAccessor/v1.4.1/SimulateTxAccessorContract_V1_4_1_Web3'

export function getSafeContractInstance(
  safeVersion: SafeVersion,
  safeContract
):
  | SafeContract_V1_4_1_Web3
  | SafeContract_V1_3_0_Web3
  | SafeContract_V1_2_0_Web3
  | SafeContract_V1_1_1_Web3
  | SafeContract_V1_0_0_Web3 {
  switch (safeVersion) {
    case '1.4.1':
      return new SafeContract_V1_4_1_Web3(safeContract)
    case '1.3.0':
      return new SafeContract_V1_3_0_Web3(safeContract)
    case '1.2.0':
      return new SafeContract_V1_2_0_Web3(safeContract)
    case '1.1.1':
      return new SafeContract_V1_1_1_Web3(safeContract)
    case '1.0.0':
      return new SafeContract_V1_0_0_Web3(safeContract)
    default:
      throw new Error('Invalid Safe version')
  }
}

export function getCompatibilityFallbackHandlerContractInstance(
  safeVersion: SafeVersion,
  compatibilityFallbackhandlerContract
){
  switch (safeVersion) {
    case '1.4.1':
      return new CompatibilityFallbackHandler_V1_4_1_Web3(
        compatibilityFallbackhandlerContract
      )
    case '1.3.0':
    case '1.2.0':
    case '1.1.1':
      return new CompatibilityFallbackHandler_V1_3_0_Web3(
        compatibilityFallbackhandlerContract
      )
    default:
      throw new Error('Invalid Safe version')
  }
}

export function getMultiSendContractInstance(
  safeVersion: SafeVersion,
  multiSendContract
): MultiSendContract_V1_4_1_Web3 | MultiSendContract_V1_3_0_Web3 | MultiSendContract_V1_1_1_Web3 {
  switch (safeVersion) {
    case '1.4.1':
      return new MultiSendContract_V1_4_1_Web3(multiSendContract)
    case '1.3.0':
      return new MultiSendContract_V1_3_0_Web3(multiSendContract)
    case '1.2.0':
    case '1.1.1':
    case '1.0.0':
      return new MultiSendContract_V1_1_1_Web3(multiSendContract)
    default:
      throw new Error('Invalid Safe version')
  }
}

export function getMultiSendCallOnlyContractInstance(
  safeVersion: SafeVersion,
  multiSendCallOnlyContract
): MultiSendCallOnlyContract_V1_4_1_Web3 | MultiSendCallOnlyContract_V1_3_0_Web3 {
  switch (safeVersion) {
    case '1.4.1':
      return new MultiSendCallOnlyContract_V1_4_1_Web3(
        multiSendCallOnlyContract
      )
    case '1.3.0':
    case '1.2.0':
    case '1.1.1':
    case '1.0.0':
      return new MultiSendCallOnlyContract_V1_3_0_Web3(
        multiSendCallOnlyContract
      )
    default:
      throw new Error('Invalid Safe version')
  }
}

export function getSafeProxyFactoryContractInstance(
  safeVersion: SafeVersion,
  safeProxyFactoryContract
):
  | SafeProxyFactoryContract_V1_4_1_Web3
  | SafeProxyFactoryContract_V1_3_0_Web3
  | SafeProxyFactoryContract_V1_1_1_Web3
  | SafeProxyFactoryContract_V1_0_0_Web3 {
  switch (safeVersion) {
    case '1.4.1':
      return new SafeProxyFactoryContract_V1_4_1_Web3(
        safeProxyFactoryContract
      )
    case '1.3.0':
      return new SafeProxyFactoryContract_V1_3_0_Web3(
        safeProxyFactoryContract
      )
    case '1.2.0':
    case '1.1.1':
      return new SafeProxyFactoryContract_V1_1_1_Web3(
        safeProxyFactoryContract
      )
    case '1.0.0':
      return new SafeProxyFactoryContract_V1_0_0_Web3(
        safeProxyFactoryContract
      )
    default:
      throw new Error('Invalid Safe version')
  }
}

export function getSignMessageLibContractInstance(
  safeVersion: SafeVersion,
  signMessageLibContract
): SignMessageLibContract_V1_4_1_Web3 | SignMessageLibContract_V1_3_0_Web3 {
  switch (safeVersion) {
    case '1.4.1':
      return new SignMessageLibContract_V1_4_1_Web3(signMessageLibContract)
    case '1.3.0':
      return new SignMessageLibContract_V1_3_0_Web3(signMessageLibContract)
    default:
      throw new Error('Invalid Safe version')
  }
}

export function getCreateCallContractInstance(
  safeVersion: SafeVersion,
  createCallContract
): CreateCallContract_V1_4_1_Web3 | CreateCallContract_V1_3_0_Web3 {
  switch (safeVersion) {
    case '1.4.1':
      return new CreateCallContract_V1_4_1_Web3(createCallContract)
    case '1.3.0':
    case '1.2.0':
    case '1.1.1':
    case '1.0.0':
      return new CreateCallContract_V1_3_0_Web3(createCallContract)
    default:
      throw new Error('Invalid Safe version')
  }
}

export function getSimulateTxAccessorContractInstance(
  safeVersion: SafeVersion,
  simulateTxAccessorContract
): SimulateTxAccessorContract_V1_4_1_Web3 | SimulateTxAccessorContract_V1_3_0_Web3 {
  switch (safeVersion) {
    case '1.4.1':
      return new SimulateTxAccessorContract_V1_4_1_Web3(
        simulateTxAccessorContract
      )
    case '1.3.0':
      return new SimulateTxAccessorContract_V1_3_0_Web3(
        simulateTxAccessorContract
      )
    default:
      throw new Error('Invalid Safe version')
  }
}
