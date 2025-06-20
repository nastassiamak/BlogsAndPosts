import { Blog } from "../domain/blog";
import { db } from "../../db/inMemoryDb";
import { BlogAttributes } from "../application/dtos/blogAttributes";
import { ObjectId, WithId } from "mongodb";
import { blogCollection } from "../../db/mongoDb";
import { BlogQueryInput } from "../routers/input/blogQueryInput";
import { RepositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import {BlogListPaginatedOutput} from "../routers/output/blogListPaginatedOutput";
import {BlogDataOutput} from "../routers/output/blogDataOutput";
import {mapToBlogOutput} from "../routers/mappers/mapToBlogOutput";

export const blogsRepository = {
  async findMany(queryDto: BlogQueryInput): Promise<BlogListPaginatedOutput> {
    console.log("blogsRepository.findMany started with queryDto:", queryDto);
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
      searchBlogNameTerm,
      searchBlogDescriptionTerm,
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchBlogNameTerm) {
      filter.name = { $regex: searchBlogNameTerm, $options: "i" };
    }

    if (searchBlogDescriptionTerm) {
      filter.description = { $regex: searchBlogDescriptionTerm, $options: "i" };
    }

    const direction = sortDirection === "asc" ? 1 : -1;

    const totalCount =
        await blogCollection.countDocuments(filter);

    const pagesCount =
        Math.ceil(totalCount / pageSize);

    const rawItems = await
        blogCollection
          .find(filter)
          .sort({ [sortBy]: direction })
          .skip(skip)
          .limit(pageSize)
          .toArray();

    // Преобразуем документы в DTO
    const items: BlogDataOutput[] =
        rawItems.map(mapToBlogOutput);

    return { pagesCount, page: pageNumber, pageSize, totalCount, items };
  },

  async findById(id: string): Promise<WithId<Blog> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },

  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    const res =
        await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError("Blog not exists");
    }
    return res;
  },

  async create(newBlog: Blog): Promise<string> {
    const insertResult =
        await blogCollection.insertOne(newBlog);

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
          // createdAt: dto.createdAt,
          // isMembership: dto.isMembership,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError("Blog not exist");
    }
    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult =
        await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError("Blog not exist");
    }
  },
};
