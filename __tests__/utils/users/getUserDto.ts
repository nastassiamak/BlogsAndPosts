import {UserAttributes} from "../../../src/users/application/dtos/userAttributes";

export function getUserDto(): UserAttributes {
    const uniqueSuffix = (`${Date.now()}${Math.floor(Math.random() * 1000)}`).slice(0, 12);

    return {
        login: `user${uniqueSuffix}`,
        password: "oksfs2342QWE",
        email: `user${uniqueSuffix}@example.com`,
    };
}