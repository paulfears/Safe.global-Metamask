
import {SafeApiKit} from './api-kit/SafeApiKit'
import {EthersAdapter} from '@safe-global/protocol-kit'
import Safe from './protocal-kit/Safe'
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
import { panel, text, heading, divider, copyable, Panel } from '@metamask/snaps-ui';
import { Utils } from './Metamask';
import { HttpProvider } from './web3HttpProvider';
import {JsonBIP44CoinTypeNode} from '@metamask/key-tree';
import { ethers } from 'ethers';



type DELIGATOR = 'deligator';
type OWNER = 'owner';
type CREATOR = 'creator';
type OBSERVER = 'observer';

type AccountTYPE = DELIGATOR | OWNER | CREATOR | OBSERVER

export class SafeWallet{
    account: ethers.Wallet;
    safe: Safe;
    safeAddress: string;
    safeApiKit;
    is_init:boolean = false;
    type: AccountTYPE
    constructor(){
        
    }

    async init(safeAddress:string, type:AccountTYPE):Promise<void>{
        console.log("in safeAddress init");
        this.safeAddress = safeAddress;
        this.type = type;
        this.account = await this.getAccount();
        console.log("about to create Web3 Adapter");
        const ethAdapter = new EthersAdapter({ethers, signerOrProvider:this.account});
        console.log("about to create Safe");
        this.safe = await Safe.create({ ethAdapter:ethAdapter, safeAddress:this.safeAddress});
        console.log("about to init safeAPIKit");
        this.safeApiKit = new SafeApiKit({
            txServiceUrl: 'https://safe-transaction-goerli.safe.global',
            ethAdapter: ethAdapter
        })
        console.log("wallet init successful")
        this.is_init = true;
    }

    



    async getAccount(): Promise<ethers.Wallet>{
        // By way of example, we will use Dogecoin, which has `coin_type` 3.
        const ethNode = (await snap.request({
            method: 'snap_getBip44Entropy',
            params: {
            coinType: 9001,
            },
        })) as JsonBIP44CoinTypeNode;
        
        const RPC_URL='https://eth-goerli.public.blastapi.io'
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
        const wallet = new ethers.Wallet(ethNode.privateKey, provider);
        return wallet;
        
    }

    


    async handleProposeTransaction(txn){
        console.log("in here");
        const disp = panel([
            text("Propose Transaction?"),
            divider(),
            text(`to: ${txn.to}`),
            text(`value: ${txn.value}`),
            text(`data: ${txn.data}`)
        ])
        const confirmation = await Utils.displayPanel(disp, 'confirmation');
        if(!confirmation){
            throw new Error("user Rejected Request");
        }
        return await this.proposeTransaction(txn);
    }

    async proposeTransaction(txn):Promise<String>{
        /*
        if(!(this.type in ['creator', 'owner', 'deligate'])){
            throw new Error('Account type does not have permission to propose a transaction')
        }
        */
        
        console.log("generating safeTransaction")
        console.log(this.safe);
        const safeTransaction = await this.safe.createTransaction({ safeTransactionData:txn })
        console.log("safeTransaction is: ");
        console.log(safeTransaction);
        console.log("this.account is: ");
        console.log(this.account);
        const senderAddress = this.account.address;
        console.log("sender address is:");
        console.log(senderAddress);
        const safeTxHash = await this.safe.getTransactionHash(safeTransaction)
        console.log("safeTxHash is : ");
        console.log(safeTxHash);
        console.log("about to generate signature");
        const signature = await this.safe.signTransactionHash(safeTxHash)
        console.log("signature is");
        console.log(signature);

        // Propose transaction to the service
        console.log("about to propose transaction");
        console.log(this.safeAddress);
        await this.safeApiKit.proposeTransaction({
            safeAddress: this.safeAddress,
            safeTransactionData: safeTransaction.data,
            safeTxHash,
            senderAddress,
            senderSignature: signature.data
        })
        console.log("here");
        
        return safeTxHash;
    }

    async addSignature(safeTxHash){
        const signature = await this.safe.signTransactionHash(safeTxHash)
        
        const signatureResponse = await this.safeApiKit.confirmTransaction(safeTxHash, signature.data);
        return signatureResponse
    }

    async signData(data){
        return this.account.signMessage(data);
    }
    
    async getSafeInfo(){
        const output = await this.safeApiKit.getSafeInfo(this.safeAddress);
        return output;
    }
    

    async getTransactionInfo(){

    }

    
}