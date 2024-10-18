import { IBlock } from "@domain/models/Block";
import { ITransaction } from "@domain/models/Transaction";

const ENERGY_COST_PER_BYTE = 4.56; // KwH

/**
 * Returns the energy cost of a transaction
 *
 * @param transaction - The transaction to calculate the energy cost
 * @returns The energy cost of the transaction
 */
export const getEnergyPerTransaction = (transaction: ITransaction): number => {
    if(!transaction) return 0.;
    if(!transaction.size) return 0.;
    return transaction.size * ENERGY_COST_PER_BYTE;
}

/**
 * Returns the total sum of the energy cost of the transactions in a block
 *
 * @param block - The block to calculate the energy cost
 * @returns The total sum of the energy
 */
export const getTotalBlockEnergy = (block: IBlock): number => {
    if(!block) return 0.;
    if(!block.transactions) return 0.;

    let totalEnergy : number = 0;
    for(const transaction of block.transactions){
        totalEnergy += transaction.size;
    }
    return totalEnergy * ENERGY_COST_PER_BYTE;
}