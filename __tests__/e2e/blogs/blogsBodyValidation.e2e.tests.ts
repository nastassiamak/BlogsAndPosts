// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";
import { setupApp } from "../../../src/setupApp";
import { BlogAttributes } from "../../../src/blogs/application/dtos/blogAttributes";
import {BLOGS_PATH, POSTS_PATH} from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { getBlogDto } from "../../utils/blogs/getBlogDto";
import { generateAdminAuthToken } from "../../utils/generateAdminAuthToken";
import { runDB, stopDb } from "../../../src/db/mongoDb";
import { clearDb } from "../../utils/clearDb";
import { createBlog } from "../../utils/blogs/createBlog";
import { getBlogById } from "../../utils/blogs/getBlogById";
import { ResourceType } from "../../../src/core/types/resourceType";
import { BlogCreateInput } from "../../../src/blogs/routers/input/blogCreateInput";
import { BlogUpdateInput } from "../../../src/blogs/routers/input/blogUpdateInput";

describe("Blog API body validation check", () => {
    const app = express();
    setupApp(app);

    const correctTestBlogAttributes: BlogAttributes = getBlogDto();
    const adminToken = generateAdminAuthToken();

    beforeAll(async () => {
        await runDB("mongodb://localhost:27017/test");
        await clearDb(app);
    });

    afterAll(async () => {
        await stopDb();
    });

    it("❌ should not create blog when incorrect body passed; POST /blogs", async () => {

        await request(app)
            .post(BLOGS_PATH)
            .send(correctTestBlogAttributes)
            .expect(HttpStatus.Unauthorized);

        const invalidDataSet1 = await request(app)
            .post(BLOGS_PATH)
            .set("Authorization", adminToken)
            .send({
                name: "    ",
                description: "      ",
                websiteUrl: "Invalid Url",
                createdAt: "12",

            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

        const invalidDataSet2 = await request(app)
            .post(BLOGS_PATH)
            .set("Authorization", adminToken)
            .send({
                name: "",
                description: "",
                websiteUrl: "",
                createdAt: 89,

            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet2.body.errorsMessages).toHaveLength(4);

        // check что никто не создался
        const blogListResponse = await request(app)
            .get(BLOGS_PATH)
        //.set("Authorization", adminToken);

        expect(blogListResponse.body.items).toHaveLength(0);
    });

    it("❌ should not update blog when incorrect data passed; PUT /blogs/:id", async () => {

        const createdBlog = await createBlog(app, correctTestBlogAttributes);
        const createdBlogId = createdBlog.id;


        const invalidDataSet1 = await request(app)
            .put(`${BLOGS_PATH}/${createdBlogId}`)
            .set("Authorization", adminToken)
            .send({

                name: "    ",
                description: "      ",
                websiteUrl: "Invalid Url",
                createdAt: "12",

            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

        const invalidDataSet2 = await request(app)
            .put(`${BLOGS_PATH}/${createdBlogId}`)
            .set("Authorization", adminToken)
            .send({

                name: "A",
                description: "      ",
                websiteUrl: "http://exp.com/",

            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet2.body.errorsMessages).toHaveLength(2);

        const blogResponse = await getBlogById(app, createdBlogId);

        expect(blogResponse).toEqual({
            ...createdBlog,
        });
    });

    it('should return 400 if title is too long and shortDescription is missing', async () => {

        // создаём блог, чтобы использовать blogId для новых постов
        const createdBlog = await createBlog(app, {
            name: 'Test Blog',
            websiteUrl: 'https://validurl.com',
            description: 'Test description',
        })
        const blogId = createdBlog.id;

        const invalidPost = {
            title: 'length_31-DrmM8lHeNjSykwSzQ7Her', // > 30 символов
            content: 'valid content',
            // shortDescription отсутствует
        };

        const response = await request(app)
            .post(`${BLOGS_PATH}/${blogId}${POSTS_PATH}`)
            .set('Authorization', adminToken)
            .send(invalidPost)
            .expect(HttpStatus.BadRequest);

        expect(response.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(response.body.errorsMessages)).toBe(true);

        const fields = response.body.errorsMessages.map((err: any) => err.field);
        expect(fields).toEqual(expect.arrayContaining(['shortDescription', 'title']));

        response.body.errorsMessages.forEach((error: any) => {
            expect(typeof error.message).toBe('string');
            expect(typeof error.field).toBe('string');
        });

    });

    it('should return 400 if all required fields are missing', async () => {
        const createdBlog = await createBlog(app, {
            name: 'Test Blog',
            websiteUrl: 'https://validurl.com',
            description: 'Test description',
        })
        const blogId = createdBlog.id;
        const invalidPost = {}; // пустое тело

        const response = await request(app)
            .post(`${BLOGS_PATH}/${blogId}${POSTS_PATH}`)
            .set('Authorization', adminToken)
            .send(invalidPost)
            .expect(HttpStatus.BadRequest);

        expect(response.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: 'title' }),
                expect.objectContaining({ field: 'shortDescription' }),
                expect.objectContaining({ field: 'content' }),
            ]),
        );
    });
})
