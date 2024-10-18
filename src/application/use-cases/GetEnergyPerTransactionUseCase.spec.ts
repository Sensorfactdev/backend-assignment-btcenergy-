import { CryptoApiService } from "@domain/ports/CryptoApiService";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { IBlock } from "@domain/models/Block";
import { ITransaction } from "@domain/models/Transaction";
import { GetEnergyPerTransactionUseCase } from "./GetEnergyPerTransactionUseCase";
 
// Mock transactions
const transaction1: ITransaction = { hash: "transaction1", size: 10 };
const transaction2: ITransaction = { hash: "transaction2", size: 20 };

// Mock blocks
const block1: IBlock = { hash: "block1", transactions: [transaction1, transaction2] };
const block2: IBlock = { hash: "block2", transactions: [] };

// Mock implementation of CryptoApiPort
const mockCryptoApiPort: jest.Mocked<CryptoApiService> = {
    getBlock: jest.fn((hash: string) => {
        if(hash === "block1") return Promise.resolve(block1);
        if(hash === "block2") return Promise.resolve(block2);
        return Promise.resolve(null);
    }),
    // Defined but not used in this test
    getTransaction: jest.fn((_hash: string) => {
        return Promise.resolve(null);
    }),
    // Defined but not used in this test
    getBlocksByDate: jest.fn((_date: Date) => {
        return Promise.resolve(null);
    })
};

const MOCK_ENERGY_COST_PER_BYTE = 2; // KwH

// Mock the getEnergyPerTransaction function
jest.mock("@application/energy_calculation", () => ({
    getEnergyPerTransaction: jest.fn((transaction : ITransaction) => transaction.size * MOCK_ENERGY_COST_PER_BYTE),
}));

// Tests
describe("GetEnergyPerTransactionUseCase", () => {
    let useCase: GetEnergyPerTransactionUseCase;

    beforeEach(() => {
        useCase = new GetEnergyPerTransactionUseCase(mockCryptoApiPort);
    });

    it("energy per transaction for block1", async () => {
        const result = await useCase.execute("block1");
        expect(result.get("transaction1")).toBe(20);
        expect(result.get("transaction2")).toBe(40);
    });

    it("empty map for block2", async () => {
        const result = await useCase.execute("block2");
        expect(result.size).toBe(0);
    });

    it("empty map for an unknown hash", async () => {
        const result = await useCase.execute("unknown_hash");
        expect(result.size).toBe(0);
    });
});
