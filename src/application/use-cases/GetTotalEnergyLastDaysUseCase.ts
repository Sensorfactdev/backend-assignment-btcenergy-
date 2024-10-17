import { getTotalBlockEnergy } from "application/energy_calculation";
import { CryptoApiPort } from "domain/ports/CryptoApiService";
import { GetTotalEnergyLastDaysInput } from "domain/ports/GetTotalEnergyLastDaysInput";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000; // ms
export class GetTotalEnergyLastDaysUseCase implements GetTotalEnergyLastDaysInput {
    private readonly cryptoApi: CryptoApiPort;

    constructor(cryptoApi: CryptoApiPort) {
        this.cryptoApi = cryptoApi;
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
            const blocks = await this.cryptoApi.getBlocksByDate(date);
            if(!blocks) return;
            const totalEnergy = await Promise.all(blocks.map(async block => {
                const blockData = await this.cryptoApi.getBlock(block.hash);
                if(!blockData) return 0.;
                return getTotalBlockEnergy(blockData);
            })).then(energies => energies.reduce((acc, energy) => acc + energy, 0));

            energyPerDay.set(date, totalEnergy);
        }));

        return energyPerDay;    
    }

}