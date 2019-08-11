import { makeExecutableSchema } from 'graphql-tools';
import {resolvers} from './resolvers';

const typeDefs = `
    type Booking {
        _id : ID!
        event : Event!
        user: User!
        createdAt: String
        updatedAt: String
    }

    type AuthData {
        userId: ID
        token: String
        expiry: Int 
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }

    type User {
        _id : ID!
        email: String!
        password: String
        createdEvents: [Event]
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type Query {
        events : [Event!]!
        users : [User!]!
        bookings: [Booking!]! 
        login(email:String, password:String): AuthData
    }

    type Mutation {
        createEvent(eventInput: EventInput) : Event
        createUser(email: String, password: String) : User
        bookEvent(eventId: ID!): Booking
        cancelBooking(bookingId: ID!): Event
    }
`;


export default makeExecutableSchema({
    typeDefs,
    resolvers
});