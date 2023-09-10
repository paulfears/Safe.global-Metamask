import { writable } from 'svelte/store';
import type {OwnerResponse, SafeInfoResponse} from '@safe-global/api-kit'
export const currentAddress = writable<string[]>([]);
export const connected = writable<boolean>(false);
export const Safes = writable<OwnerResponse>();
export const SafeInfo = writable<any>({});
export const SnapId = writable<string>(`local:http://localhost:8080/`);
export const SafeAPIKit = writable<any>(null);
export const snapAddress = writable<string>([]);
//const safeInfo: SafeInfoResponse = await safeService.getSafeInfo(safeAddress)