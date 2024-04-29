import { ApolloServer } from "@apollo/server";
import { prismaClient } from "../config/db";
import { User } from './user'
async function createApolloGraphqlServer() {
     const gqlServer = new ApolloServer({
         typeDefs: `
            ${User.typeDefs}
            type Query{
                ${User.queries}
            
            
            }
            type Mutation{
                ${User.mutations}
            }
        
        `,//schema
        resolvers: {
            Query: {
                ...User.resolvers.queries,
                
                  
            },
            Mutation: {
                ...User.resolvers.mutations,
            }
        }
    });
    
    
    await gqlServer.start();
    return gqlServer;
}

export default createApolloGraphqlServer;