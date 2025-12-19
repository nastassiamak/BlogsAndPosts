export type JwtPayload = {
  userId: string;
  login: string;
  iat?: number;
  exp?: number;
};
