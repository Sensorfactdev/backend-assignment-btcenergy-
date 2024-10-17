import { getTotalBlockEnergy } from "application/energy_calculation";
import { BlockChainService } from "domain/ports/BlockChainService";
import { GetTotalEnergyLastDaysInput } from "domain/ports/GetTotalEnergyLastDaysInput";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000; // ms
export class GetTotalEnergyLastDaysUseCase implements GetTotalEnergyLastDaysInput {
    private readonly BlockChainService: BlockChainService;

    constructor(BlockChainService: BlockChainService) {
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

        // TODO: Although this is run concurrently, it still is slow, this can be optimized
        // - Workers
        // - At caching to calls from BlockChainService
        await Promise.all(dates.map(async date => {
            const blocks = await this.BlockChainService.getBlocksByDate(date);
            if(!blocks) return;
            const totalEnergy = await Promise.all(blocks.map(async block => {
                const blockData = await this.BlockChainService.getBlock(block.hash);
                if(!blockData) return 0.;
                return getTotalBlockEnergy(blockData);
            })).then(energies => energies.reduce((acc, energy) => acc + energy, 0));

            energyPerDay.set(date, totalEnergy);
        }));

        return energyPerDay;    
    }

}