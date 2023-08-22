
import express from "express";
import { createServer } from "node:http";
import { PubSub } from "graphql-subscriptions";
import fs from "node:fs"
import { ApolloServer } from "@apollo/server";
import { resolvers } from './resolvers/resolvers'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { useServer } from "graphql-ws/lib/use/ws"
import { WebSocketServer } from "ws";
import { expressMiddleware } from "@apollo/server/express4"
import bodyParser from "body-parser";
import { makeExecutableSchema } from "graphql-tools";
import dontenv from "dotenv";
import { GraphQLError } from "graphql";
import { User } from "./models/user/user-model";
import { Request } from "express";
import { getUserfromToken } from "./utils";


interface MyContext {
    user?: User,

}


dontenv.config()

const typeDefs = fs.readFileSync(__dirname + "/schema/schema.gql", "utf8");
export const pubsub = new PubSub();

(async function () {
    const app = express();
    const httpServer = createServer(app);

    const schema = makeExecutableSchema({ typeDefs, resolvers })


    const ws = new WebSocketServer({
        server: httpServer,
        path: "/graphql",

    })
    ws.on('connection', () => {
        console.log("Connected!!")
    })

    const serverCleanup = useServer({
        schema, context: (ctx, msg, args) => {
            return ({ pubsub })
        },
    }, ws)
    const server = new ApolloServer<MyContext>({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose()
                    }
                }
            },
        }, {
            async requestDidStart({ contextValue }) {

            },
        }],

    });
    await server.start();

    app.use("/graphql",
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const user = await getUserfromToken(req);
                return { user }
            },
        })
    )
    httpServer.listen(4000, () => console.log(`Server listening on localhost:4000/graphql`))

})()
