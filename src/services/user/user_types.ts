


export interface NewUserInput {
    name: string;
    email: string;
    password: string;
    username: string;
}

export interface UpdateUserInput {
    name: string;
    username: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}