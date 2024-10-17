import { IHash } from "./Hash";

export interface ITransaction extends IHash {
    size: number; // Bytes
}