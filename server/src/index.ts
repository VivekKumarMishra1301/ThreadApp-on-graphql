import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
// import cors from 'cors';
import express from 'express';
import { prismaClient } from './config/db';


async function startApp() {
    


    const app = express();
    app.use(express.json());
    const PORT = Number(process.env.PORT) || 3000;
    app.get('/', (req, res) => {
        res.json({ message: 'Server is up and Running' })
    });
    
    
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query{

                hello:String
                say(name:String):String
            }
            type Mutation{
                createUser(firstName:String!, lastName:String!,email:String!,password:String!):Boolean
            }
        
        `,//schema
        resolvers: {
            Query: {
                hello: () => 'Hello bro',
                say:(_,{name}:{name:string})=>`Hey ${name}`
            },
            Mutation: {
                createUser: async (_, { firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => {
                    await prismaClient.user.create({
                        data: { firstName: firstName, lastName: lastName, email,password, salt: 'random_salt', },
                    });
                    return true;
                }
            }
        }
    });
    
    
    await gqlServer.start();
    app.use('/graphql',expressMiddleware(gqlServer))
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

startApp();


