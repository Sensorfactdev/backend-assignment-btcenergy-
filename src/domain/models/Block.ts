import { IHash } from "./Hash";
import { ITransaction } from "./Transaction";

export interface IBlock extends IHash {
    transactions: ITransaction[];
}