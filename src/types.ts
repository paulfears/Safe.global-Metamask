export type account_types = 'deligator' | 'creator' | 'owner' | 'observer'
export interface DataWallet{
    type: 'deligator' | 'creator' | 'owner' | 'observer',
    name: string,
    id: string,
    safeAddress: string,
    runPreFlight: boolean
}