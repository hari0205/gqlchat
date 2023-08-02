
import { NewUserInput, UpdateUserInput } from "./user_types"
import { User } from "../../models/user/user-model"
import { GraphQLError } from "graphql"


export const createUserResolver = async (parent: unknown, { createinput }: { createinput: NewUserInput }, context: any): Promise<User> => {
    const { name, username, password, email } = createinput;
    const user = User.build({ name, username, password, email });
    try {
        const saved_user = await user.save()
        if (!saved_user) {
            throw new Error('Could not save user');
        }
        return saved_user;
    } catch (err: any) {
        console.log(err.errors)
        if (err.name === 'SequelizeUniqueConstraintError') {

            throw new GraphQLError('Error saving user: ' + err.errors[0]?.message)
        } else {
            throw new GraphQLError('Error saving user: ' + err.message)
        }
    }

}

export const updateUserResolver = async (parent: unknown, { updateinput, uname }: { updateinput: UpdateUserInput, uname: String }, context: any) => {
    const { name, username, password } = updateinput;
    const user = await User.findOne({
        where: {
            username: uname,
        },

    },)
    if (!user) {
        throw new GraphQLError("User does not exist: ");
    }
    const [res, users]: [res: number, users: User[]] = await User.update({
        name,
        username,
        password,
    }, {
        where: {
            username: uname,
        },
        returning: true,

    })
    if (res > 0) {
        return users[0];
    }
}


export const deleteUserResolver = async (parent: unknown, { uid }: { uid: String }, context: any) => {
    return await User.destroy({
        where: {
            uid
        },

    })
}