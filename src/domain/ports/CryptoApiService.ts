import { IBlock } from "@domain/models/Block";
import { IHash } from "@domain/models/Hash";
import { ITransaction } from "@domain/models/Transaction";

/**
 * The CprytoApiService interface is a port to the Crypto API
 */
export interface CryptoApiService {
    getBlock(hash: string): Promise<IBlock | null>;
    getTransaction(hash: string): Promise<ITransaction | null>;
    getBlocksByDate(date: Date): Promise<IHash[] | null>;
}