import { PostQueryInput } from "../routers/input/postQueryInput";
import { PostListPaginatedOutput } from "../routers/output/postListPaginatedOutput";
import { postCollection } from "../../db/mongoDb";
import { PostDataOutput } from "../routers/output/postDataOutput";
import { mapToPostOutput } from "../routers/mappers/mapToPostOutput";
import { ObjectId, WithId } from "mongodb";
import { Post } from "../domain/post";
import { RepositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";

export const postsQueryRepository = {
  async findMany(queryDto: PostQueryInput): Promise<PostListPaginatedOutput> {
    console.log("postsRepository.findMany started with queryDto:", queryDto);
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    const direction = sortDirection === "asc" ? 1 : -1;

    const totalCount = await postCollection.countDocuments(filter);

    const pagesCount = Math.ceil(totalCount / pageSize);

    const rawItems = await postCollection
      .find(filter)
      .sort({ [sortBy]: direction, _id: 1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const items: PostDataOutput[] = rawItems.map(mapToPostOutput);

    return { pagesCount, page: pageNumber, pageSize, totalCount, items };
  },

  async findPostsByBlog(
    queryDto: PostQueryInput,
    blogId: string,
  ): Promise<PostListPaginatedOutput> {
    console.log("postsRepository.findMany started with queryDto:", queryDto);
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = { blogId: blogId };

    const direction = sortDirection === "asc" ? 1 : -1;

    const totalCount = await postCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const rawItems = await postCollection
      .find(filter)
      .sort({ [sortBy]: direction, _id: 1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const items: PostDataOutput[] = rawItems.map(mapToPostOutput);

    return { pagesCount, page: pageNumber, pageSize, totalCount, items };
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },

  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    if (!ObjectId.isValid(id)) {
      throw new RepositoryNotFoundError("Invalid post ID");
    }
    const res = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError("Post not exists");
    }
    return res;
  },
};
