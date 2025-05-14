import {PostQueryInput} from "../routers/input/postQueryInput";
import {ObjectId, WithId} from "mongodb";
import {Post} from "../domain/post";
import {blogCollection, postCollection} from "../../db/mongoDb";
import {RepositoryNotFoundError} from "../../core/errors/repositoryNotFoundError";
import {PostAttributes} from "../application/dtos/postInputDto";
import {blogsRepository} from "../../blogs/repositories/blogsRepository";
import {blogService} from "../../blogs/application/blogService";

export const postsRepository = {

    async findMany(
        queryDto: PostQueryInput,
    ): Promise<{items: WithId<Post>[]; totalCount: number}> {
        const {pageNumber, pageSize, sortBy, sortDirection} = queryDto;
        const filter = {};
        const skip = (pageNumber - 1) * pageSize;

        const [items, totalCount] = await Promise.all([
            postCollection
                .find(filter)
                .sort({[sortBy]: sortDirection})
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            postCollection.countDocuments(filter),
        ]);
        return {items, totalCount};
    },

    async findPostsByBlog(
        queryDto: PostQueryInput,
        blogId: string,
    ): Promise<{items: WithId<Post>[]; totalCount: number}> {
        const {pageNumber, pageSize, sortBy, sortDirection} = queryDto;
        const filter = {'blog.id': blogId};
        const skip = (pageNumber - 1) * pageSize;

        const [items, totalCount] = await Promise.all([
            postCollection
                .find(filter)
                .sort({[sortBy]: sortDirection})
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            postCollection.countDocuments(filter),
        ]);
        return {items, totalCount};
    },

    async findById(id: string): Promise<WithId<Post> | null> {
        return postCollection.findOne({_id: new Object(id)});
    },

    async findByIdOrFail(id: string): Promise<WithId<Post> | null> {
        const res = await postCollection.findOne({_id: new Object(id)});

        if (!res) {
            throw new RepositoryNotFoundError('Post not exist')
        }
        return res;
    },

    async createPost(blogId: string, newPost: Post): Promise<string> {
        // const blog = await blogService.findByIdOrFail(blogId)
        //
        // if (!blog) {
        //     throw new RepositoryNotFoundError('Blog not found')
        // }
        //
        const insertResult = await postCollection.insertOne(newPost);
        return insertResult.insertedId.toString();
    },

    async updatePost(id: string, dto: PostAttributes): Promise<void> {
        const blog = await blogService.findByIdOrFail(id)
        const blogName = blog ? blog.name : "Неизвестный блог";

        const updateResult = await postCollection.updateOne(
            {
                _id: new ObjectId(id)
            }, {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: dto.blogId,
                    blogName: blogName,
                    createdAt: dto.createdAt,
                }
            });

        if (updateResult.matchedCount < 1) {
            throw new RepositoryNotFoundError('Post not exist');
        }
        return;
    },

    async deletePost(id: string): Promise<void> {
        const deleteResult =
            await postCollection.deleteOne(
                {
                    _id: new ObjectId(id)
                });

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Post not exist');
        }
    }
}