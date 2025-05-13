export type Post = {
    title: string // max 30
    shortDescription: string // max 100
    content: string // max 1000
    blog: {
        blogId: string // valid
        blogName: string
        createdAt: string
    }
}