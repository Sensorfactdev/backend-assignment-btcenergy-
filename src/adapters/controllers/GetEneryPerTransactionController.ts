import { GetEnergyPerTransactionUseCase } from "application/use-cases/GetEnergyPerTransactionUseCase";
import { GetEnergyPerTransactionInput } from "domain/ports/GetEnergyPerTransactionInput";


export class GetEnergyPerTransactionController {
    private readonly useCase: GetEnergyPerTransactionInput;

    constructor(useCase : GetEnergyPerTransactionInput) {
        this.useCase = useCase;
    }

    async handle(request : any): Promise<any> {
        const { blockHash } = request;

        const results : Map<string, number> = await this.useCase.execute(blockHash);
        return Array.from(results.entries()).map(([hash, energy]) => ({hash,energy}));

    }
}