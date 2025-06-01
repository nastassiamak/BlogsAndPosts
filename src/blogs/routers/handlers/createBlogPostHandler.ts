// import { Request, Response } from "express";
// import { PostCreateInput } from "../../../posts/routers/input/postCreateInput";
// import { blogService } from "../../application/blogService";
// import { mapToPostOutput } from "../../../posts/routers/mappers/mapToPostOutput";
// import { postService } from "../../../posts/application/postService";
//
// import { HttpStatus } from "../../../core/types/httpStatus";
// //import { errorsHandler } from "../../../core/errors/errorsHandler";
// import { mapToBlogPostOutput } from "../mappers/mapToBlogPostOutput";
// import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";
//
// export async function createBlogPostHandler(
//   req: Request<{ id: string }, {}, PostCreateInput>,
//   res: Response,
// ): Promise<void> {
//
// try {
//     const blogId = req.params.id;
//     if (typeof blogId !== "string") {
//         res.status(HttpStatus.BadRequest).json({ errorsMessages: [{ field: "blogId", message: "not string" }] });
//     }
//
//     const { title, shortDescription, content} = req.body;
//     const blog = await blogService.findByIdOrFail(blogId);
//     if (!blog) {
//         res.status(HttpStatus.NotFound).send({ message: "Blog not found" });
//     }
//
//     const createdPostId = await postService.create({
//         blogId,
//         blogName: blog.name,
//         title,
//         shortDescription,
//         content,
//         createdAt: new Date().toISOString(),
//     });
//     const createdPost = await postService.findByIdOrFail(createdPostId);
//
//     //const postOutput = mapToBlogPostOutput(blog, createdPost);
//
//     res.status(HttpStatus.Created).send(createdPost);
// } catch (error) {
//     if (error instanceof RepositoryNotFoundError) {
//         res.status(HttpStatus.NotFound).send({ message: 'Blog not found' });
//     }
//
//     console.error("Error in createBlogPostHandler:", error);
//      res.status(HttpStatus.InternalServerError).send("Internal Server Error");
// }
//
// }
