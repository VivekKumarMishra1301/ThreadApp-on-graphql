import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
// import cors from 'cors';
import express from 'express';


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
            }
        
        `,//schema
        resolvers: {
            Query: {
                hello:()=>'Hello bro'
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


