import {Blog} from "../blogs/domain/blog";

export const db = {
    blogs: <Blog[]> [
        {
            name: "N1",
            description: 'D1',
            websiteUrl: "W1",
            createdAt: new Date().toISOString(),
            isMembership: false,
        },

        {
            name: "N2",
            description: 'D2',
            websiteUrl: "W2",
            createdAt: new Date().toISOString(),
            isMembership: false,
        },
        {
            name: "N3",
            description: 'D3',
            websiteUrl: "W3",
            createdAt: new Date().toISOString(),
            isMembership: false,
        }
    ]
}