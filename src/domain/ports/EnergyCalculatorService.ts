import { IBlock } from "domain/models/Block";
import { ITransaction } from "domain/models/Transaction";

export interface EnergyCalculatorService {
    getEnergyPerTransaction(transaction : ITransaction): number;
    getTotalBlockEnergy(block: IBlock): number;
}