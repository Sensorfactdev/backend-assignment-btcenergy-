import { getEnergyPerTransaction } from "application/utils/energy_calculation";
import { BlockChainService } from "domain/ports/BlockChainService";
import { GetEnergyPerTransactionInput } from "domain/ports/GetEnergyPerTransactionInput";

export class GetEnergyPerTransactionUseCase implements GetEnergyPerTransactionInput {
    private readonly blockChainService: BlockChainService;

    constructor(blockChainService: BlockChainService) {
        this.blockChainService = blockChainService;
    }

    async execute(blockHash: string): Promise<Map<string, number>> {
        let energyPerTransaction = new Map<string, number>();

        const block = await this.blockChainService.getBlock(blockHash);
        if(!block) return energyPerTransaction;

        for(const transaction of block.tx){
            energyPerTransaction.set(transaction.hash, getEnergyPerTransaction(transaction));
        }

       return energyPerTransaction;    
    }
}