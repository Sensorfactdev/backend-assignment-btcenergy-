import fetch from 'node-fetch';
import { CryptoApiPort } from "@domain/ports/CryptoApiService";
import { IBlock } from "@domain/models/Block";
import { ITransaction } from "@domain/models/Transaction";
import { IHash } from "@domain/models/Hash";

export class BlockChainRestAdapter implements CryptoApiPort {
    private readonly baseUrl: string;

    constructor() {
         this.baseUrl = 'https://blockchain.info';
    }

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

    async getTransaction(hash: string): Promise<ITransaction | null> {
        const response = await this.fetchEndpoint(`/rawtx/${hash}`);
        return response;
    }

    async getBlocksByDate(date: Date): Promise<IHash[] | null> {
        const timeMilliseconds = date.getTime();
        const response = await this.fetchEndpoint(`/blocks/${timeMilliseconds}?format=json`);
        return response;
    }
}