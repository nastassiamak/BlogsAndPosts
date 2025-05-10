import request from "supertest";
import express from "express";
import {setupApp} from "../../../src/setupApp";
import {BlogInputDto} from "../../../src/blogs/dto/blogInputDto";
import {HttpStatus} from "../../../src/core/types/httpStatus";
import {BLOGS_PATH} from "../../../src/core/paths/paths";
import {generateAdminAuthToken} from "../../utils/generateAdminAuthToken";
import {runDB} from "../../../src/db/mongoDb";
import {clearDb} from "../../utils/clearDb";
import {getBlogDto} from "../../utils/blogs/getBlogDto";
import {createBlog} from "../../utils/blogs/createBlog";
import {getBlogById} from "../../utils/blogs/getBlogById";
import {updateBlog} from "../../utils/blogs/updateBlog";

describe("Blog API", () => {
    const app = express();
    setupApp(app);

    const adminToken = generateAdminAuthToken();

    beforeAll(async () => {
        await runDB('mongodb://localhost:27017/blogs-platform');
        await clearDb(app);
    });

    it('should create a blog; POST /api/blogs', async () => {
        const newBlog: BlogInputDto = {
            ...getBlogDto(),
            name: "Name2",
            description: "Description 2",
            websiteUrl: "http://example.com/",
        };

        await createBlog(app,newBlog);
    });

    it('should return blogs list; GET /api/blogs', async () => {
        await createBlog(app)
        await createBlog(app)

        const response = await request(app)
            .get(BLOGS_PATH)
            .set('Authorization', adminToken)
            .expect(HttpStatus.Ok);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should return blog by id; GET /api/blogs/:id', async () => {
        const createdBlog =
            await createBlog(app)

        const blog = await getBlogById(app, createdBlog.id)
        
        expect(blog).toEqual({
            ...createdBlog,
            id: expect.any(String),
            createdAt: expect.any(String),
        });
        
    });

    it('should update blog; PUT /api/blogs/:id', async () => {
        const createdBlog =
            await createBlog(app);

        const blogUpdateData: BlogInputDto = {
            name: 'Updated Blog',
            description: "Description new",
            websiteUrl: "http://example.com/",
        };

        await updateBlog(app, createdBlog.id, blogUpdateData);

        const blogResponse = await getBlogById(app, createdBlog.id);

        expect(blogResponse).toEqual({
            id: createdBlog.id,
            name: blogUpdateData.name,
            description: blogUpdateData.description,
            websiteUrl: blogUpdateData.websiteUrl,
            createdAt: expect.any(String),
            isMembership: blogUpdateData.isMembership,
        })
    });

    it('should delete blog and check after "NOT FOUND"; DELETE /api/blogs/:id', async () => {
        const createdBlog =
            await createBlog(app);


        await request(app)
            .delete(`${BLOGS_PATH}/${createdBlog.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NoContent);


        await request(app)
            .get(`${BLOGS_PATH}/${createdBlog.id}`)
            .set('Authorization', adminToken)
            .expect(HttpStatus.NotFound);

    });


})