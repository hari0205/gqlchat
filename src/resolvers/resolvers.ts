import { User } from "../models/user/user-model"
import { GraphQLError } from "graphql"
import { createUserResolver, deleteUserResolver, updateUserResolver } from "../services/user/user-services"
import { addMessageMutation, createChatRoomMutation, updateChatRoomMutation } from "../services/chatroom/chatroom-service"
import { ChatRoom } from "../models/chatrooms/chatroom-model"
import { Messages } from "../models/messages/message-model"







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
        },
        chatRoom: async (_parent: unknown, { ID }: { ID: string }, _ctx: any) => {
            const chatroom = await ChatRoom.findByPk(ID);
            if (!chatroom) throw new GraphQLError(`Could not find chatroom with ID ${ID}`)
            return chatroom;
        },
        // TODO: Implement full text search
        chatRoomList: async (_parent: unknown, { slug }: { slug: string }, _ctx: any) => {
            const chatroom = await ChatRoom.findOne({
                where: {
                    slug,
                },

            })

            if (!chatroom) throw new GraphQLError("Chat room with slug not found.")
            return chatroom;
        },
        message: async (_parent: unknown, { ID }: { ID: number }, _ctx: any) => {
            const message = await Messages.findByPk(ID);
            console.log(message)
            if (!message) throw new GraphQLError("Could not find message");
            return message;
        },
        messages: async (_parent: unknown, args: any, _ctx: any) => {
            const messages = await Messages.findAll();
            return messages;
        }
    },
    Mutation: {
        // User Resolvers
        createUser: createUserResolver,
        updateUser: updateUserResolver,
        deleteUser: deleteUserResolver,

        //ChatRoom Resolvers
        createChatRoom: createChatRoomMutation,
        updateChatRoom: updateChatRoomMutation,

        // Messages Resolvers
        addMessage: addMessageMutation,

    }
}