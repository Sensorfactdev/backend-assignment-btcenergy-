import fetch from 'node-fetch';
import { CryptoApiService } from "@domain/ports/CryptoApiService";
import { IBlock } from "@domain/models/Block";
import { ITransaction } from "@domain/models/Transaction";
import { IHash } from "@domain/models/Hash";

/**
 * The BlockChainRestAdapter class is an adapter for the BlockChain API
 */
export class BlockChainRestAdapter implements CryptoApiService {
    private readonly baseUrl: string;

    constructor() {
         this.baseUrl = 'https://blockchain.info';
    }

    /**
     * Main method to actually fetch data from the API
     * 
     * @param pathQuery - The path and query to fetch (e.g. /path/to/resource?query=1)
     * @returns Response from the API
     */
    async fetchEndpoint(pathQuery: string): Promise<any> {
        try {
            const fetchUrl = `${this.baseUrl}${pathQuery}`;
            const response = await fetch(fetchUrl);
            if(!response.ok){
                throw Error(`${pathQuery} - ${response.status} - ${response.statusText}`)
            }
            return await response.json();
        } catch (error : any) {
            console.error(`Failed to fetch: ${error.message}`);
            return null;
        }
    }

    /**
     * Get block data corresponding to the block hash
     * 
     * @param hash - The hash of the block
     * @returns API block data
     */
    async getBlock(hash: string): Promise<IBlock | null> {
        const response = await this.fetchEndpoint(`/rawblock/${hash}`);
        if (response) {
            const block: IBlock = {
                hash: response.hash,
                transactions: response.tx
            };
            return block;
        }
        return null;
    }

    /**
     * Get transaction data corresponding to the transaction hash
     * 
     * @param hash - The hash of the transaction
     * @returns API transaction data
     */
    async getTransaction(hash: string): Promise<ITransaction | null> {
        const response = await this.fetchEndpoint(`/rawtx/${hash}`);
        return response;
    }

    /**
     * Get all the block hashes mined on a specific date
     * 
     * @param date The date to get the blocks from (time part is ignored)
     * @returns List of block hashes
     */
    async getBlocksByDate(date: Date): Promise<IHash[] | null> {
        const timeMilliseconds = date.getTime();
        const response = await this.fetchEndpoint(`/blocks/${timeMilliseconds}?format=json`);
        return response;
    }
}