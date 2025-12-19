import { PostQueryInput } from "../routers/input/postQueryInput";
import { ObjectId, WithId } from "mongodb";
import { Post } from "../domain/post";
import { postCollection } from "../../db/mongoDb";
import { RepositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { PostAttributes } from "../application/dtos/postAttributes";
import { PostListPaginatedOutput } from "../routers/output/postListPaginatedOutput";
import { PostDataOutput } from "../routers/output/postDataOutput";
import { mapToPostOutput } from "../routers/mappers/mapToPostOutput";

export const postsRepository = {
  async createPost(newPost: Post): Promise<string> {
    const insertResult = await postCollection.insertOne(newPost);

    return insertResult.insertedId.toString();
  },

  async updatePost(id: string, dto: PostAttributes): Promise<void> {
    const updateResult = await postCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError("Post not exists");
    }
    return;
  },

  async deletePost(id: string): Promise<void> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError("Post not exists");
    }
  },
};
