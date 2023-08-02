
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../utils";
import { Messages } from "../messages/message-model";





export class ChatRoom extends Model { }


ChatRoom.init({

    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [10, 20]
        }
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(val) {
            const slug = (val as string)
                .trim() // Remove leading and trailing spaces
                .toLowerCase() // Convert the string to lowercase
                .replace(/[^a-zA-Z0-9]+/g, '-') // Replace non-alphanumeric characters with dashes
                .replace(/-{2,}/g, '-') // Replace multiple dashes with a single dash
                .replace(/^-|-$/g, ''); // Remove leading and trailing dashes

            this.setDataValue("slug", slug)
        },
        get() {
            return this.getDataValue("slug");
        }
    }

}, {
    sequelize,
    createdAt: true,
    deletedAt: true,
    modelName: "ChatRoom"
})


ChatRoom.hasMany(Messages, { foreignKey: "id", as: "messages" });