import { Blog } from "../domain/blog";
import { BlogAttributes } from "../application/dtos/blogAttributes";
import { ObjectId } from "mongodb";
import { blogCollection } from "../../db/mongoDb";
import { RepositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";

export const blogsRepository = {

  async create(newBlog: Blog): Promise<string> {
    const insertResult = await blogCollection.insertOne(newBlog);

    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: BlogAttributes): Promise<void> {
    const updateResult = await blogCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError("Blog not exist");
    }
    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError("Blog not exist");
    }
  },
};
