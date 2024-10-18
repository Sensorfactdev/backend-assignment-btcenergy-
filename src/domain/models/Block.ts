import { IHash } from "./Hash";
import { ITransaction } from "./Transaction";

/**
 * The block interface used in CryptoApiService, composed of a hash and a list of transactions
 */
export interface IBlock extends IHash {
    transactions: ITransaction[];
}