
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../utils";
import { Messages } from "../messages/message-model";
import { User } from "../user/user-model";





export class ChatRoom extends Model { }


ChatRoom.init({

    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5, 20]
        }
    },
    description: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 300],

        }
    },
    slug: {
        type: DataTypes.STRING,
        unique: true,
    }

}, {
    sequelize,
    createdAt: true,
    deletedAt: true,
    modelName: "ChatRoom",
    hooks: {
        beforeCreate(attributes, _) {
            const title = attributes.getDataValue("title")
            const slug = generateSlug(title);
            attributes.setDataValue("slug", slug);
        },
    }
})
// Associations
// User.hasMany(Messages);
Messages.belongsTo(ChatRoom,);
//Messages.belongsTo(User);
ChatRoom.hasMany(Messages,);



function generateSlug(title: string) {
    return title
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-|-$/g, '');

}