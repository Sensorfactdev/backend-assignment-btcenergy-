import { IHash } from "./Hash";
import { ITransaction } from "./Transaction";

export interface IBlock extends IHash {
    tx: ITransaction[];
}