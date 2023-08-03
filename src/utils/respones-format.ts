import { Model } from "sequelize";
import { ChatRoom } from "../models/chatrooms/chatroom-model";
import { Messages } from "../models/messages/message-model";




export function formatResponse(res: any) {
    if (res instanceof ChatRoom) {
        const combinedDataValues = { ...res.dataValues, messages: res.dataValues.Messages };
        return combinedDataValues;

    }
    else if (res instanceof Messages) {
        return res?.dataValues?.ChatRoom
    }

    return {}
}