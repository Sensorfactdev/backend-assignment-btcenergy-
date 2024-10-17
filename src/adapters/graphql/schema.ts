import { GetEnergyPerTransactionController } from 'adapters/controllers/GetEneryPerTransactionController';
import { GetTotalEnergyLastDaysController } from 'adapters/controllers/GetTotalEnergyLastDaysController';
import { BlockChainRestAdapter } from 'adapters/outbound/BlockChainRestAdapter';
import { GetEnergyPerTransactionUseCase } from 'application/use-cases/GetEnergyPerTransactionUseCase';
import { GetTotalEnergyLastDaysUseCase } from 'application/use-cases/GetTotalEnergyLastDaysUseCase';
import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDate, SchemaComposer } from 'graphql-compose'

const schemaComposer = new SchemaComposer()

// Secondary adapters, output
const BlockChainService = new BlockChainRestAdapter();

// Use-cases
const getEnergyPerTransactionUseCase = new GetEnergyPerTransactionUseCase(BlockChainService);
const getTotalEnergyLastDaysUseCase = new GetTotalEnergyLastDaysUseCase(BlockChainService);

// Primary adapters, input
const getEnergyPerTransactionController = new GetEnergyPerTransactionController(getEnergyPerTransactionUseCase);
const getTotalEnergyLastDaysController = new GetTotalEnergyLastDaysController(getTotalEnergyLastDaysUseCase);

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
      return getEnergyPerTransactionController.handle({blockHash});
    }
  },
  energyLastDays: {
    type: new GraphQLList(energyLastDays),
    args: {
      days: { type: GraphQLInt}
    }, 
    resolve: async (_, { days } : {days: number}) => {
      return getTotalEnergyLastDaysController.handle({days});
    }
  },
})

export const schema = schemaComposer.buildSchema()
