interface IUser {
    username?: string;
    password: string;
    email: string;
    createdAt?: Date;
    lastLoginAt?: Date;
}

export default IUser