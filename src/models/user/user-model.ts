
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../utils";
import bcrypt from "bcrypt";
import { Messages } from "../messages/message-model";
import { ChatRoom } from "../chatrooms/chatroom-model";


export class User extends Model { }


User.init({
    uid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    username: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
            len: [4, 12],
        },
        unique: true,
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.ENUM("ADMIN", "USER"),
        defaultValue: "USER",
    }

}, {
    sequelize,
    modelName: "User",
    timestamps: true,
    createdAt: true,
    updatedAt: true,

})


User.addHook("beforeCreate", async (user, options) => {


    const hashedpass = await bcrypt.hash(user.getDataValue("password") as string, 10)
    user.setDataValue("password", hashedpass);
})

User.hasMany(Messages)
Messages.belongsTo(User)
User.belongsToMany(ChatRoom, { through: "UserChatRoom" })
ChatRoom.belongsToMany(User, { through: 'UserChatRoom' });