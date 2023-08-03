import { Model } from "sequelize";




enum Role {
    ADMIN,
    USER
}

interface BaseAttr {
    id?: number;
    uid?: string;
    createdAt: Date;
    updatedAt: Date;
}



interface GenericInstance<T> extends Model<BaseAttr & T>, BaseAttr {
    name?: string;
    username?: string
    email?: string
    password?: string
    role?: Role
    content?: string,
    title: string,
    slug: string
}


export function formatResponse(res: GenericInstance<any>) {
    return {
        id: res?.dataValues.id,
        title: res?.dataValues.title,
        description: res?.dataValues.description,
        slug: res?.dataValues.slug,
        createdAt: res?.dataValues.createdAt,
        updatedAt: res?.dataValues.updatedAt,
        messages: res?.dataValues.Messages // Use the transformed Messages array from the Sequelize response
    };
}