const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Tax {
    _id: String
    name: String
    number: Int
  }

  type Query {
    taxs: [Tax]
  }

  type Mutation {
    tax(name: String!, number: Int!): Tax!
  }
`;

export default typeDefs;
