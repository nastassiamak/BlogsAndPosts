export type JwtPayload = {
    userId: string;
    login: string;
    email: string;
    iat?: number;
    exp?: number;
}