import { GetEnergyPerTransactionUseCase } from '@application/use-cases/GetEnergyPerTransactionUseCase';
import { GetTotalEnergyLastDaysUseCase } from '@application/use-cases/GetTotalEnergyLastDaysUseCase';
import { BlockChainRestAdapter } from '@adapters/outbound/BlockChainRestAdapter';
import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDate, SchemaComposer } from 'graphql-compose'

const schemaComposer = new SchemaComposer()

// Secondary adapters, output
const BlockChainService = new BlockChainRestAdapter();

// Use-cases
const getEnergyPerTransactionUseCase = new GetEnergyPerTransactionUseCase(BlockChainService);
const getTotalEnergyLastDaysUseCase = new GetTotalEnergyLastDaysUseCase(BlockChainService);

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
      let energyPerTransaction = await getEnergyPerTransactionUseCase.execute(blockHash);
      return Array.from(energyPerTransaction, ([hash, energy]) => ({ hash, energy }));
    }
  },
  energyLastDays: {
    type: new GraphQLList(energyLastDays),
    args: {
      days: { type: GraphQLInt}
    }, 
    resolve: async (_, { days } : {days: number}) => {
      let energyPerDay = await getTotalEnergyLastDaysUseCase.execute(days);
      return Array.from(energyPerDay, ([date, energy]) => ({ date, energy }));
    }
  },
})

export const schema = schemaComposer.buildSchema()
