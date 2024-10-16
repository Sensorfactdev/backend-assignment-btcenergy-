import { IBlock } from "domain/models/Block";
import { BlockChainService } from "domain/ports/BlockChainService";
import { EnergyCalculatorService } from "domain/ports/EnergyCalculatorService";

export class GetEnergyPerTransactionUseCase {
    private readonly energyCalculator: EnergyCalculatorService;
    private readonly blockChainService: BlockChainService;

    constructor(energyCalculator: EnergyCalculatorService, blockChainService: BlockChainService) {
        this.energyCalculator = energyCalculator;
        this.blockChainService = blockChainService;
    }

    async execute(blockHash: string): Promise<Map<string, number>> {
        let energyPerTransaction = new Map<string, number>();

        const block = await this.blockChainService.getBlock(blockHash);
        if(!block) return energyPerTransaction;

        for(const transaction of block.tx){
            energyPerTransaction.set(transaction.hash, this.energyCalculator.getEnergyPerTransaction(transaction));
        }

       return energyPerTransaction;    
    }
}