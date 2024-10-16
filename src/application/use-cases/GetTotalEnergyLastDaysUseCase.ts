import { BlockChainService } from "domain/ports/BlockChainService";
import { EnergyCalculatorService } from "domain/ports/EnergyCalculatorService";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000; // ms

export class GetTotalEnergyLastDaysUseCase {
    private readonly energyCalculator: EnergyCalculatorService;
    private readonly BlockChainService: BlockChainService;

    constructor(energyCalculator: EnergyCalculatorService, BlockChainService: BlockChainService) {
        this.energyCalculator = energyCalculator;
        this.BlockChainService = BlockChainService;
    }

    async execute(days: number): Promise<Map<Date, number>> {
        let energyPerDay = new Map<Date, number>();

        const now = Date.now();
        let dates : Date[] = [];
        for(let i = 0; i < days; i++){
            const day = new Date(now - i * DAY_IN_MILLISECONDS);
            dates.push(day);
        }

        // TODO: Although this is run concurrently, it still is slow, time wise we leave it out of scope
        await Promise.all(dates.map(async date => {
            const blocks = await this.BlockChainService.getBlocksByDate(date);
            if(!blocks) return;
            const totalEnergy = await Promise.all(blocks.map(async block => {
                const blockData = await this.BlockChainService.getBlock(block.hash);
                if(!blockData) return 0.;
                return this.energyCalculator.getTotalBlockEnergy(blockData);
            })).then(energies => energies.reduce((acc, energy) => acc + energy, 0));

            energyPerDay.set(date, totalEnergy);
        }));

         return energyPerDay;    
    }

}