import { makeExecutableSchema } from 'graphql-tools';
import {resolvers} from './resolvers';

const typeDefs = `
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type Query {
        events : [Event!]!
    }

    type Mutation {
        createEvent(eventInput: EventInput) : Event
    }
`;


export default makeExecutableSchema({
    typeDefs,
    resolvers
});