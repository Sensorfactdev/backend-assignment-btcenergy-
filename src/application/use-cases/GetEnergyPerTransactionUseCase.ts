import { getEnergyPerTransaction } from "@application/energy_calculation";
import { CryptoApiService } from "@domain/ports/CryptoApiService";

/**
 * Use case to calculate the energy of each transaction in a block
 * @constructor cryptoApi - The crypto API port to retrieve blocks data
 */
export class GetEnergyPerTransactionUseCase {
    private readonly cryptoApi: CryptoApiService;

    constructor(blockChainService: CryptoApiService) {
        this.cryptoApi = blockChainService;
    }

    /**
     * Returns the energy of each transaction in a block
     * 
     * @param blockHash hash of the block
     * @returns A map with energy per transaction
     */
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