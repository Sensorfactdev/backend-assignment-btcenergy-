import { GetEnergyPerTransactionUseCase } from "application/use-cases/GetEnergyPerTransactionUseCase";
import { GetTotalEnergyLastDaysUseCase } from "application/use-cases/GetTotalEnergyLastDaysUseCase";
import { GetTotalEnergyLastDaysInput } from "domain/ports/GetTotalEnergyLastDaysInput";


export class GetTotalEnergyLastDaysController {
    private readonly useCase: GetTotalEnergyLastDaysInput;

    constructor(useCase : GetTotalEnergyLastDaysInput) {
        this.useCase = useCase;
    }

    async handle(request : any): Promise<any> {
        const { days } = request;
        const results : Map<Date, number> = await this.useCase.execute(days);
        return Array.from(results.entries()).map(([date, energy]) => ({date,energy}));
    }
}