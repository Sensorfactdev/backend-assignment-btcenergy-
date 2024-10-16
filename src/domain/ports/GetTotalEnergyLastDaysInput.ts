export interface GetTotalEnergyLastDaysInput {
    execute(days: number): Promise<Map<Date,number>>;
}