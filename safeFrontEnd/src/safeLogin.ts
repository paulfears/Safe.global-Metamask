import { Web3AuthModalPack, Web3AuthConfig } from '@safe-global/auth-kit'
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { Web3AuthOptions } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { ethers } from 'ethers';

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1",
    rpcTarget: "https://rpc.ankr.com/eth",
    displayName: "Ethereum Mainnet",
    blockExplorer: "https://goerli.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
  };

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  });


// https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments
const options: Web3AuthOptions = {
  clientId: 'BFcsAKDt90-JXaWPIRoiG7Nvem4r5-sLenUdY9W-oNq3WVBSBE6Zhn876YIbbU9sB_vmJRUxlGfDtB4FhVDe4hY', // https://dashboard.web3auth.io/
  web3AuthNetwork: 'testnet',
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x5',
    // https://chainlist.org/
    rpcTarget: 'https://rpc.ankr.com/eth_goerli'
  },
  uiConfig: {
    theme: 'dark',
    loginMethodsOrder: ['google', 'facebook']
  }
}

// https://web3auth.io/docs/sdk/pnp/web/modal/initialize#configuring-adapters


// https://web3auth.io/docs/sdk/pnp/web/modal/whitelabel#whitelabeling-while-modal-initialization
const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: 'mandatory'
  },
  adapterSettings: {
    uxMode: 'popup',
    whiteLabel: {
      name: 'Safe'
    }
  },
  privateKeyProvider
})

const web3AuthConfig: Web3AuthConfig = {
  txServiceUrl: 'https://safe-transaction-goerli.safe.global'
}

// Instantiate and initialize the pack
const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig)
await web3AuthModalPack.init({ options, adapters: [openloginAdapter] })

export async function login(){
    const out = await web3AuthModalPack.signIn()
    console.log(out);
    const provider = new ethers.providers.Web3Provider(web3AuthModalPack.getProvider())
    const signer = provider.getSigner();
    console.log("signer is: ");
    console.log(signer);
    return out;
}