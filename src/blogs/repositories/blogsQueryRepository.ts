import { BlogQueryInput } from "../routers/input/blogQueryInput";
import { BlogListPaginatedOutput } from "../routers/output/blogListPaginatedOutput";
import { blogCollection } from "../../db/mongoDb";
import { BlogDataOutput } from "../routers/output/blogDataOutput";
import { mapToBlogOutput } from "../routers/mappers/mapToBlogOutput";
import { ObjectId, WithId } from "mongodb";
import { Blog } from "../domain/blog";
import { RepositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";

export const blogsQueryRepository = {
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

    const totalCount = await blogCollection.countDocuments(filter);

    const pagesCount = Math.ceil(totalCount / pageSize);

    const rawItems = await blogCollection
      .find(filter)
      .sort({ [sortBy]: direction })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    // Преобразуем документы в DTO
    const items: BlogDataOutput[] = rawItems.map(mapToBlogOutput);

    return { pagesCount, page: pageNumber, pageSize, totalCount, items };
  },

  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    const res = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError("Blog not exists");
    }
    return res;
  },
};
