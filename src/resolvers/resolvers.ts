import { User } from "../models/user/user-model"
import { GraphQLError } from "graphql"
import { createUserResolver, deleteUserResolver, updateUserResolver } from "../services/user/user-services"
import { addMessageMutation, createChatRoomMutation, deleteChatRoomMutation, updateChatRoomMutation } from "../services/chatroom/chatroom-service"
import { ChatRoom } from "../models/chatrooms/chatroom-model"
import { Messages } from "../models/messages/message-model"
import { formatResponse } from "../utils"







export const resolvers = {
    Query: {
        greeting: () => {
            return { text: "Hello!" }
        },
        user: async (_parent: unknown, { ID }: { ID: string }, _ctx: any) => {
            const user = await User.findByPk(ID, {
                include: [Messages],
            });
            if (!user) throw new GraphQLError(`Could not find user with ID ${ID}`)
            return user;
        },
        users: async () => {
            const users = await User.findAll();
            if (users.length == 0) throw new GraphQLError(`Could not find users`);
            return users;
        },
        chatRoom: async (_parent: unknown, { ID }: { ID: string }, _ctx: any) => {
            const chatroom = await ChatRoom.findOne({
                where: {
                    id: parseInt(ID),
                },
                include: [{
                    model: Messages,
                    include: [User]
                }, {
                    model: User
                }]
            });
            if (!chatroom) throw new GraphQLError(`Could not find chatroom with ID ${ID}`)
            const res = formatResponse(chatroom)
            return res;
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
            const message = await Messages.findByPk(ID, {
                include: [User, ChatRoom]
            });
            if (!message) throw new GraphQLError("Could not find message");
            const res = formatResponse(message);
            return res;
        },
        messages: async (_parent: unknown, _args: any, _ctx: any) => {
            const messages = await Messages.findAll({
                include: [User, ChatRoom],
            });
            if (!messages) throw new GraphQLError("Could not find any message");
            const res = formatResponse(messages);
            return res;
        }
    },
    Mutation: {
        // User Resolvers
        createUser: createUserResolver,
        updateUser: updateUserResolver,
        deleteUser: deleteUserResolver,

        // TODO: Login Resolver

        //ChatRoom Resolvers
        createChatRoom: createChatRoomMutation,
        updateChatRoom: updateChatRoomMutation,
        deleteChatRoom: deleteChatRoomMutation,

        // Messages Resolvers
        addMessage: addMessageMutation,

    },
    Subscription: {
        messageSent: {
            subscribe: (_parent: any, _args: any, ctx: any, _: any) => {
                return ctx.pubsub.subscribe("messageSent")
            },
            resolve: (payload: any) => formatResponse(payload)
        }
    }
}