import { getEnergyPerTransaction } from "@application/energy_calculation";
import { CryptoApiPort } from "@domain/ports/CryptoApiService";

export class GetEnergyPerTransactionUseCase {
    private readonly cryptoApi: CryptoApiPort;

    constructor(blockChainService: CryptoApiPort) {
        this.cryptoApi = blockChainService;
    }

    async execute(blockHash: string): Promise<Map<string, number>> {
        let energyPerTransaction = new Map<string, number>();

        const block = await this.cryptoApi.getBlock(blockHash);
        if(!block) return energyPerTransaction;

        for(const transaction of block.transactions){
            energyPerTransaction.set(transaction.hash, getEnergyPerTransaction(transaction));
        }

       return energyPerTransaction;    
    }
}