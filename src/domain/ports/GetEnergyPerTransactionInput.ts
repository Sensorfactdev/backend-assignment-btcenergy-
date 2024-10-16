export interface GetEnergyPerTransactionInput {
    execute(hash: string): Promise<Map<string, number>>;
}