import './style.css'

const snapId = `local:http://localhost:8080/`

import { MetamaskCaller } from './metamaskCaller'
console.log("snapid at main.ts is: ");
console.log(snapId);
const client = new MetamaskCaller(snapId);
const connectButton = document.getElementById('connect');
const createAccountButton = document.getElementById('createAccount');
const listAccountsButton = document.getElementById('listAccounts');
console.log(client);
connectButton?.addEventListener('click', client.connect.bind(client));
createAccountButton?.addEventListener('click', async (e)=>{await client.createAccount("hello")})
listAccountsButton?.addEventListener('click', async (e)=>{await client.listAccounts()})