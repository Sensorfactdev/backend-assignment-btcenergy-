import { EnergyCalculatorInternalAdapter } from 'adapters/internal/EnergyCalculatorInternalAdapter';
import { BlockChainRestAdapter } from 'adapters/outbound/BlockChainRestAdapter';
import { GetEnergyPerTransactionUseCase } from 'application/use-cases/GetEnergyPerTransactionUseCase';
import { GetTotalEnergyLastDaysUseCase } from 'application/use-cases/GetTotalEnergyLastDaysUseCase';
import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDate, SchemaComposer } from 'graphql-compose'

const schemaComposer = new SchemaComposer()

// adapters
const energyCalculator = new EnergyCalculatorInternalAdapter();
const BlockChainService = new BlockChainRestAdapter();

// use-cases
const getEnergyPerTransactionUseCase = new GetEnergyPerTransactionUseCase(energyCalculator, BlockChainService);
const getTotalEnergyLastDaysUseCase = new GetTotalEnergyLastDaysUseCase(energyCalculator, BlockChainService);

// Define return types
const energyPerTransactionType = new GraphQLObjectType({
  name: 'EnergyPerTransaction',
  fields: {
    hash: { type: GraphQLString },
    energy: { type: GraphQLFloat },
  }
});

const energyLastDays = new GraphQLObjectType({
  name: 'EnergyLastDays',
  fields: {
    date: { type: GraphQLDate },
    energy: { type: GraphQLFloat },
  }
});

schemaComposer.Query.addFields({
  hello: {
    type: 'String!',
    resolve: () => 'Hi there, good luck with the assignment!',
  },
  energyPerTransaction: {
    type: new GraphQLList(energyPerTransactionType),
    args: {
      blockHash: 'String!'
    }, 
    resolve: async (_, { blockHash } : {blockHash: string}) => {
      let map = await getEnergyPerTransactionUseCase.execute(blockHash);
      let results = Array.from(map.entries()).map(([hash, energy]) => ({hash,energy}));
      return results;
    }
  },
  energyLastDays: {
    type: new GraphQLList(energyLastDays),
    args: {
      days: { type: GraphQLInt}
    }, 
    resolve: async (_, { days } : {days: number}) => {
      let map = await getTotalEnergyLastDaysUseCase.execute(days);
      let results = Array.from(map.entries()).map(([date, energy]) => ({date,energy}));
      return results;
    }
  },
})

export const schema = schemaComposer.buildSchema()
