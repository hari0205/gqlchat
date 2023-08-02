import express from "express"
import fs from "fs"
import { createSchema, createYoga } from "graphql-yoga"
import { resolvers } from "./resolvers/resolvers"
import { sequelize as dbconn } from "./utils"

console.log(__dirname)
const typeDefs = fs.readFileSync(__dirname + "/schema/schema.gql", "utf8")

const schema = createSchema({
    typeDefs,
    resolvers
})


const yoga = createYoga({ schema, maskedErrors: false });

const app = express();

app.use(yoga.graphqlEndpoint, yoga);

(async function () {
    try {
        await dbconn.authenticate()
        await dbconn.sync({ force: true })
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})()


app.listen(3000, () => {
    console.log('Running a GraphQL API server at http://localhost:3000/graphql')
})