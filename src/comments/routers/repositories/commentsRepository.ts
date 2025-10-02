import { CommentListPaginatedOutput } from "../output/commentListPaginatedOutput";
import { CommentQueryInput } from "../input/commentQueryInput";
import { commentCollection } from "../../../db/mongoDb";
import { CommentDataOutput } from "../output/commentDataOutput";
import { mapToCommentOutput } from "../mappers/mapToCommentOutput";
import { ObjectId, WithId } from "mongodb";
import { RepositoryNotFoundError } from "../../../core/errors/repositoryNotFoundError";
import { Comments } from "../../domain/comment";
import { CommentAttributes } from "../../application/dto/commentAttributes";
import {CommentUpdateInput} from "../input/commentUpdateInput";

export const commentsRepository = {
  async findMany(
      postId: string,
    queryDto: CommentQueryInput,
  ): Promise<CommentListPaginatedOutput> {
    console.log("commentsRepository.findMany started with queryDto:", queryDto);
    const {
      pageNumber = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortDirection = "asc",
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {postId};
    const direction = sortDirection === "asc" ? 1 : -1;

    const totalCount = await commentCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    const rawItems = await commentCollection
      .find(filter)
      .sort({ [sortBy]: direction })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const items: CommentDataOutput[] = rawItems.map(mapToCommentOutput);

    return { pagesCount, page: pageNumber, pageSize, totalCount, items };
  },

  async createComment(newComment: Comments): Promise<string> {
    const insertResult = await commentCollection.insertOne(newComment);
    return insertResult.insertedId.toString();
  },

  async findByIdOrFail(id: string): Promise<WithId<Comments>> {
    const res = await commentCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError("Comment not exists");
    }
    return res;
  },

  async updateComment(id: string, dto: CommentUpdateInput): Promise<void> {
    const updateResult = await commentCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          content: dto.content,
        },
      },
    );
  },

  async deleteComment(id: string): Promise<void> {
    const deleteResult = await commentCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError("Comment not exists");
    }
  },
};
