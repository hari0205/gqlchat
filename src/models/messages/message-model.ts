import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../utils";
import { User } from "../user/user-model";
import { ChatRoom } from "../chatrooms/chatroom-model";



export class Messages extends Model { }


Messages.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Messages",
})

Messages.belongsTo(ChatRoom, { foreignKey: "id", as: "chatroom" });
