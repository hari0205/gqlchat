import { Model } from "sequelize";
import { ChatRoom } from "../models/chatrooms/chatroom-model";
import { Messages } from "../models/messages/message-model";
import { User } from "../models/user/user-model";




export function formatResponse(res: any) {
    if (res instanceof ChatRoom) {
        const messagesWithUser = res.dataValues?.Messages?.map((message: any) => ({
            ...message.dataValues,
            sentBy: message.User.dataValues
        }));
        const combinedDataValues = { ...res.dataValues, messages: messagesWithUser };
        return combinedDataValues;

    }
    else if (res instanceof Messages) {
        const combinedDataValues = { ...res.dataValues, sentBy: res.dataValues?.User?.dataValues, room: res.dataValues?.ChatRoom?.dataValues };
        return combinedDataValues;
    } else if (res instanceof User) {

    }

    return {}
}