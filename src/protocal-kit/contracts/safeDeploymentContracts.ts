import { ContractNetworkConfig } from '../types'
import {
  CompatibilityFallbackHandlerContract,
  CreateCallContract,
  EthAdapter,
  MultiSendCallOnlyContract,
  MultiSendContract,
  SafeContract,
  SafeProxyFactoryContract,
  SafeVersion,
  SignMessageLibContract,
  SimulateTxAccessorContract
} from '@safe-global/safe-core-sdk-types'
import {
  DeploymentFilter,
  SingletonDeployment,
  getCompatibilityFallbackHandlerDeployment,
  getCreateCallDeployment,
  getMultiSendCallOnlyDeployment,
  getMultiSendDeployment,
  getProxyFactoryDeployment,
  getSafeL2SingletonDeployment,
  getSafeSingletonDeployment,
  getSignMessageLibDeployment,
  getSimulateTxAccessorDeployment
} from '../../safe-deployments'
import { safeDeploymentsL1ChainIds, safeDeploymentsVersions } from './config'

interface GetContractInstanceProps {
  ethAdapter: EthAdapter
  safeVersion: SafeVersion
  customContracts?: ContractNetworkConfig
}

interface GetSafeContractInstanceProps extends GetContractInstanceProps {
  isL1SafeMasterCopy?: boolean
  customSafeAddress?: string
}

export function getSafeContractDeployment(
  safeVersion: SafeVersion,
  chainId: number,
  isL1SafeMasterCopy = false
): SingletonDeployment | undefined {
  const version = safeDeploymentsVersions[safeVersion].safeMasterCopyVersion
  console.log("standard Deploy");
  console.log(version);
  const filters: DeploymentFilter = { version, network: chainId.toString(), released: true }
  console.log(filters);
  if (safeDeploymentsL1ChainIds.includes(chainId) || isL1SafeMasterCopy) {
    console.log("L1singleTon");
    return getSafeSingletonDeployment(filters)
  }
  console.log("L2Signleton");
  return getSafeL2SingletonDeployment(filters)
}

export function getCompatibilityFallbackHandlerContractDeployment(
  safeVersion: SafeVersion,
  chainId: number
): SingletonDeployment | undefined {
  const version = safeDeploymentsVersions[safeVersion].compatibilityFallbackHandler
  return getCompatibilityFallbackHandlerDeployment({
    version,
    network: chainId.toString(),
    released: true
  })
}

export function getMultiSendCallOnlyContractDeployment(
  safeVersion: SafeVersion,
  chainId: number
): SingletonDeployment | undefined {
  const version = safeDeploymentsVersions[safeVersion].multiSendCallOnlyVersion
  return getMultiSendCallOnlyDeployment({ version, network: chainId.toString(), released: true })
}

export function getMultiSendContractDeployment(
  safeVersion: SafeVersion,
  chainId: number
): SingletonDeployment | undefined {
  const version = safeDeploymentsVersions[safeVersion].multiSendVersion
  console.log("multisend");
  console.log(version);
  return getMultiSendDeployment({ version, network: chainId.toString(), released: true })
}

export function getSafeProxyFactoryContractDeployment(
  safeVersion: SafeVersion,
  chainId: number
): SingletonDeployment | undefined {
  const version = safeDeploymentsVersions[safeVersion].safeProxyFactoryVersion
  console.log("proxy");
  console.log(version);
  return getProxyFactoryDeployment({ version, network: chainId.toString(), released: true })
}

export function getSignMessageLibContractDeployment(
  safeVersion: SafeVersion,
  chainId: number
): SingletonDeployment | undefined {
  const version = safeDeploymentsVersions[safeVersion].signMessageLibVersion
  console.log("signMessageLib");
  console.log(version);
  return getSignMessageLibDeployment({ version, network: chainId.toString(), released: true })
}

export function getCreateCallContractDeployment(
  safeVersion: SafeVersion,
  chainId: number
): SingletonDeployment | undefined {
  const version = safeDeploymentsVersions[safeVersion].createCallVersion
  return getCreateCallDeployment({ version, network: chainId.toString(), released: true })
}

export function getSimulateTxAccessorContractDeployment(
  safeVersion: SafeVersion,
  chainId: number
): SingletonDeployment | undefined {
  const version = safeDeploymentsVersions[safeVersion].createCallVersion
  return getSimulateTxAccessorDeployment({ version, network: chainId.toString(), released: true })
}

export async function getSafeContract({
  ethAdapter,
  safeVersion,
  customSafeAddress,
  isL1SafeMasterCopy,
  customContracts
}: GetSafeContractInstanceProps): Promise<SafeContract> {
  const chainId = await ethAdapter.getChainId()
  const singletonDeployment = getSafeContractDeployment(safeVersion, chainId, isL1SafeMasterCopy)
  const safeContract = await ethAdapter.getSafeContract({
    safeVersion,
    singletonDeployment,
    customContractAddress: customSafeAddress ?? customContracts?.safeMasterCopyAddress,
    customContractAbi: customContracts?.safeMasterCopyAbi
  })
  const isContractDeployed = await ethAdapter.isContractDeployed(safeContract.getAddress())
  if (!isContractDeployed) {
    throw new Error('SafeProxy contract is not deployed on the current network')
  }
  console.log("safeContract is:");
  console.log(safeContract)
  return safeContract
}

export async function getProxyFactoryContract({
  ethAdapter,
  safeVersion,
  customContracts
}: GetContractInstanceProps): Promise<SafeProxyFactoryContract> {
  const chainId = await ethAdapter.getChainId()
  const proxyFactoryDeployment = getSafeProxyFactoryContractDeployment(safeVersion, chainId)
  const safeProxyFactoryContract = await ethAdapter.getSafeProxyFactoryContract({
    safeVersion,
    singletonDeployment: proxyFactoryDeployment,
    customContractAddress: customContracts?.safeProxyFactoryAddress,
    customContractAbi: customContracts?.safeProxyFactoryAbi
  })
  const isContractDeployed = await ethAdapter.isContractDeployed(
    safeProxyFactoryContract.getAddress()
  )
  if (!isContractDeployed) {
    throw new Error('SafeProxyFactory contract is not deployed on the current network')
  }
  return safeProxyFactoryContract
}

export async function getCompatibilityFallbackHandlerContract({
  ethAdapter,
  safeVersion,
  customContracts
}: GetContractInstanceProps): Promise<CompatibilityFallbackHandlerContract> {
  const chainId = await ethAdapter.getChainId()
  const fallbackHandlerDeployment = getCompatibilityFallbackHandlerContractDeployment(
    safeVersion,
    chainId
  )
  const fallbackHandlerContract = await ethAdapter.getCompatibilityFallbackHandlerContract({
    safeVersion,
    singletonDeployment: fallbackHandlerDeployment,
    customContractAddress: customContracts?.fallbackHandlerAddress,
    customContractAbi: customContracts?.fallbackHandlerAbi
  })
  const isContractDeployed = await ethAdapter.isContractDeployed(
    fallbackHandlerContract.getAddress()
  )
  if (!isContractDeployed) {
    throw new Error('CompatibilityFallbackHandler contract is not deployed on the current network')
  }
  return fallbackHandlerContract
}

export async function getMultiSendContract({
  ethAdapter,
  safeVersion,
  customContracts
}: GetContractInstanceProps): Promise<MultiSendContract> {
  const chainId = await ethAdapter.getChainId()
  const multiSendDeployment = getMultiSendContractDeployment(safeVersion, chainId)
  const multiSendContract = await ethAdapter.getMultiSendContract({
    safeVersion,
    singletonDeployment: multiSendDeployment,
    customContractAddress: customContracts?.multiSendAddress,
    customContractAbi: customContracts?.multiSendAbi
  })
  const isContractDeployed = await ethAdapter.isContractDeployed(multiSendContract.getAddress())
  if (!isContractDeployed) {
    throw new Error('MultiSend contract is not deployed on the current network')
  }
  return multiSendContract
}

export async function getMultiSendCallOnlyContract({
  ethAdapter,
  safeVersion,
  customContracts
}: GetContractInstanceProps): Promise<MultiSendCallOnlyContract> {
  const chainId = await ethAdapter.getChainId()
  const multiSendCallOnlyDeployment = getMultiSendCallOnlyContractDeployment(safeVersion, chainId)
  const multiSendCallOnlyContract = await ethAdapter.getMultiSendCallOnlyContract({
    safeVersion,
    singletonDeployment: multiSendCallOnlyDeployment,
    customContractAddress: customContracts?.multiSendCallOnlyAddress,
    customContractAbi: customContracts?.multiSendCallOnlyAbi
  })
  const isContractDeployed = await ethAdapter.isContractDeployed(
    multiSendCallOnlyContract.getAddress()
  )
  if (!isContractDeployed) {
    throw new Error('MultiSendCallOnly contract is not deployed on the current network')
  }
  return multiSendCallOnlyContract
}

export async function getSignMessageLibContract({
  ethAdapter,
  safeVersion,
  customContracts
}: GetContractInstanceProps): Promise<SignMessageLibContract> {
  const chainId = await ethAdapter.getChainId()
  const signMessageLibDeployment = getSignMessageLibContractDeployment(safeVersion, chainId)
  const signMessageLibContract = await ethAdapter.getSignMessageLibContract({
    safeVersion,
    singletonDeployment: signMessageLibDeployment,
    customContractAddress: customContracts?.signMessageLibAddress,
    customContractAbi: customContracts?.signMessageLibAbi
  })
  const isContractDeployed = await ethAdapter.isContractDeployed(
    signMessageLibContract.getAddress()
  )
  if (!isContractDeployed) {
    throw new Error('SignMessageLib contract is not deployed on the current network')
  }
  return signMessageLibContract
}

export async function getCreateCallContract({
  ethAdapter,
  safeVersion,
  customContracts
}: GetContractInstanceProps): Promise<CreateCallContract> {
  const chainId = await ethAdapter.getChainId()
  const createCallDeployment = getCreateCallContractDeployment(safeVersion, chainId)
  const createCallContract = await ethAdapter.getCreateCallContract({
    safeVersion,
    singletonDeployment: createCallDeployment,
    customContractAddress: customContracts?.createCallAddress,
    customContractAbi: customContracts?.createCallAbi
  })
  const isContractDeployed = await ethAdapter.isContractDeployed(createCallContract.getAddress())
  if (!isContractDeployed) {
    throw new Error('CreateCall contract is not deployed on the current network')
  }
  return createCallContract
}

export async function getSimulateTxAccessorContract({
  ethAdapter,
  safeVersion,
  customContracts
}: GetContractInstanceProps): Promise<SimulateTxAccessorContract> {
  const chainId = await ethAdapter.getChainId()
  const simulateTxAccessorDeployment = getSimulateTxAccessorContractDeployment(safeVersion, chainId)
  const simulateTxAccessorContract = await ethAdapter.getSimulateTxAccessorContract({
    safeVersion,
    singletonDeployment: simulateTxAccessorDeployment,
    customContractAddress: customContracts?.simulateTxAccessorAddress,
    customContractAbi: customContracts?.simulateTxAccessorAbi
  })
  const isContractDeployed = await ethAdapter.isContractDeployed(
    simulateTxAccessorContract.getAddress()
  )
  if (!isContractDeployed) {
    throw new Error('SimulateTxAccessor contract is not deployed on the current network')
  }
  return simulateTxAccessorContract
}
