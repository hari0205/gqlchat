import { User } from "../models/user/user-model"
import { GraphQLError } from "graphql"
import { createUserResolver, deleteUserResolver, updateUserResolver } from "../services/user/user-services"







export const resolvers = {
    Query: {
        greeting: () => {
            return { text: "Hello!" }
        },
        user: async (_parent: unknown, { ID }: { ID: string }, _ctx: any) => {
            const user = await User.findByPk(ID);
            if (!user) throw new GraphQLError(`Could not find user with ID ${ID}`)
            return user;
        },
        users: async () => {
            const users = await User.findAll();
            if (users.length == 0) throw new GraphQLError(`Could not find users`);
            return users;
        }
    },
    Mutation: {
        // User Resolvers
        createUser: createUserResolver,
        updateUser: updateUserResolver,
        deleteUser: deleteUserResolver,

        //
    }
}