import { IBlock } from "domain/models/Block";
import { IHash } from "domain/models/Hash";
import { ITransaction } from "domain/models/Transaction";

export interface BlockChainService {
    getBlock(hash: string): Promise<IBlock | null>;
    getTransaction(hash: string): Promise<ITransaction | null>;
    getBlocksByDate(date: Date): Promise<IHash[] | null>;
}