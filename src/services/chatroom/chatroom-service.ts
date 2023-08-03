import { GraphQLError } from "graphql";
import { ChatRoom } from "../../models/chatrooms/chatroom-model"
import { Messages } from "../../models/messages/message-model";
import { formatResponse } from "../../utils";



export const createChatRoomMutation = async (_parent: unknown, { title }: { title: string }, _ctx: any) => {
    const chatroom = ChatRoom.build({ title })
    try {
        const saved_room = await chatroom.save();
        if (!saved_room) throw new GraphQLError(`Could not create chat room!, Chat room with title ${title} may already exist.`);
        return saved_room;
    } catch (err: any) {
        throw new GraphQLError("Error creating chat room", err)
    }
}




export const updateChatRoomMutation = async (_parent: unknown, { id, title }: { id: string, title: string }, _ctx: any) => {
    const chatroom = ChatRoom.findByPk(id);
    if (!chatroom) throw new Error("Could not find chatroom");
    const [_, updatedRoom] = await ChatRoom.update({
        title,
    }, {
        returning: true,
        where: {
            id
        }
    })

    return updatedRoom[0];
}

export const addMessageMutation = async (_parent: unknown, { slug, message }: { slug: string, message: string }, _ctx: any) => {
    const chatroom = await ChatRoom.findOne({
        where: {
            slug,
        }

    });

    if (!chatroom) throw new Error("Could not find chatroom. Enter valid chatroom");

    console.log(chatroom.dataValues);
    const newmessage = await Messages.create({ content: message, ChatRoomId: chatroom.dataValues.id })
    if (!newmessage) throw new GraphQLError("Could not send message");
    const updateChatRoom = await ChatRoom.findOne({
        where: {
            slug,
        },
        include: [Messages]
    })

    if (!updateChatRoom) throw new Error("Could not find chatroom. Try again");

    const res = formatResponse(updateChatRoom);

    return res;
}