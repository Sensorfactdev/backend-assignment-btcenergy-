import { IHash } from "./Hash";

/**
 * The transaction interface used in CryptoApiService, composed of a hash and a size in bytes
 */
export interface ITransaction extends IHash {
    size: number;
}