import { GraphQLError } from "graphql";
import { ChatRoom } from "../../models/chatrooms/chatroom-model"
import { Messages } from "../../models/messages/message-model";
import { formatResponse } from "../../utils";
import { User } from "../../models/user/user-model";


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

export const addMessageMutation = async (_parent: unknown, { slug, message, sentBy }: { slug: string, message: string, sentBy: string }, _ctx: any) => {
    const chatroom = await ChatRoom.findOne({
        where: {
            slug,
        }

    });

    if (!chatroom) throw new Error("Could not find chatroom. Enter valid chatroom");
    const user = await User.findByPk(sentBy);
    if (!user) throw new GraphQLError("Could not find user");


    const newmessage = await Messages.create({ content: message, ChatRoomId: chatroom.dataValues.id, UserUid: sentBy })
    if (!newmessage) throw new GraphQLError("Could not send message");
    _ctx.pubsub.publish("messageSent", newmessage)
    const updateChatRoom = await ChatRoom.findOne({
        where: {
            slug,
        },
        include: [{ model: Messages, include: [User] }]
    })
    if (!updateChatRoom) throw new Error("Could not find chatroom. Try again");
    const res = formatResponse(updateChatRoom);
    return res;
}


export const deleteChatRoomMutation = () => {

}