import express from "express"
import fs from "fs"
import http from "http"
import { YogaServer, createPubSub, createSchema, createYoga } from "graphql-yoga"
import { useServer } from 'graphql-ws/lib/use/ws'
import { resolvers } from "./resolvers/resolvers"
import { sequelize as dbconn } from "./utils"
import ws from "ws";
// import { Redis } from "ioredis"
// import { createRedisEventTarget } from "@graphql-yoga/redis-event-target"

// const publishClient = new Redis()
// const subscribeClient = new Redis()

// const eventTarget = createRedisEventTarget({ subscribeClient, publishClient })


const pubsub = createPubSub({})
const typeDefs = fs.readFileSync(__dirname + "/schema/schema.gql", "utf8")

const schema = createSchema({
    typeDefs,
    resolvers,

})


const yoga = createYoga({
    schema, maskedErrors: false, context: { pubsub }
});

const app = express();
const httpServer = http.createServer(app);
const wss = new ws.WebSocket.Server({ server: httpServer, path: yoga.graphqlEndpoint })
wss.on("connection", () => {
    console.log("***************************** CONNECTION ESTABLISHED************************");
})
app.use(yoga.graphqlEndpoint, yoga);

useServer(
    {
        execute: (args: any) => args.rootValue.execute(args),
        subscribe: (args: any) => args.rootValue.subscribe(args),
        onSubscribe: async (ctx, msg) => {
            const { schema, execute, subscribe, contextFactory, parse, validate } = yoga.getEnveloped({
                ...ctx,
                req: ctx.extra.request,
                socket: ctx.extra.socket,
                params: msg.payload
            })

            const args = {
                schema,
                operationName: msg.payload.operationName,
                document: parse(msg.payload.query),
                variableValues: msg.payload.variables,
                contextValue: await contextFactory(),
                rootValue: {
                    execute,
                    subscribe
                }
            }

            const errors = validate(args.schema, args.document)
            if (errors.length) return errors
            return args
        }
    },
    wss
);

(async function () {
    try {
        await dbconn.authenticate()
        await dbconn.sync({ force: true })
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})()


httpServer.listen(3000, () => {
    console.log('Running a GraphQL API server at http://localhost:3000/graphql')
})