import { IBlock } from "domain/models/Block";
import { ITransaction } from "domain/models/Transaction";
import { EnergyCalculatorService } from "domain/ports/EnergyCalculatorService";

const ENERGY_COST_PER_BYTE = 4.56; // KwH

export class EnergyCalculatorInternalAdapter implements EnergyCalculatorService {
    getEnergyPerTransaction(transaction: ITransaction): number {
        return transaction.size * ENERGY_COST_PER_BYTE;
    }
    getTotalBlockEnergy(block: IBlock): number {
        let totalEnergy : number = 0;
        for(const transaction of block.tx){
            totalEnergy += transaction.size;
        }
        return totalEnergy * ENERGY_COST_PER_BYTE;
    }
}