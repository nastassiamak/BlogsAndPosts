import {setupApp} from "../../../src/setupApp";
import express from "express";
import {BlogInputDto} from "../../../src/blogs/application/dtos/blogInputDto";
import request from "supertest";
import {BLOGS_PATH, TESTING_PATH} from "../../../src/core/paths/paths";
import {HttpStatus} from "../../../src/core/types/httpStatus";
import {it} from "node:test";
import {getBlogDto} from "../../utils/blogs/getBlogDto";
import {generateAdminAuthToken} from "../../utils/generateAdminAuthToken";
import {runDB, stopDb} from "../../../src/db/mongoDb";
import {clearDb} from "../../utils/clearDb";
import {createBlog} from "../../utils/blogs/createBlog";
import {getBlogById} from "../../utils/blogs/getBlogById";

describe('Blog API body validation check', () => {
    const app = express();
    setupApp(app);

   const correctTestBlogData: BlogInputDto = getBlogDto();

   const adminToken = generateAdminAuthToken();

    beforeAll(async () => {
        await runDB('mongodb://localhost:27017/blog-platform');
        await clearDb(app);
    });

    afterAll(async () => {
        await stopDb();
    });

    it('❌ should not create blog when incorrect body passed; POST /api/blogs', async () => {

        await request(app)
            .post(BLOGS_PATH)
            .send(correctTestBlogData)
            .expect(HttpStatus.Unauthorized)


        const invalidDataSet1 =
            await request(app)
                .post(BLOGS_PATH)
                .set('Authorization', adminToken)
                .send({
                    name: '    ',
                    description: '      ',
                    websiteUrl: 'Invalid Url',
                    createdAt: '12',
                    isMembership: true,
                })
                .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorMessages).toHaveLength(5);

        const invalidDataSet2 =
            await request(app)
                .post(BLOGS_PATH)
                .set('Authorization', adminToken)
                .send({
                    name: '',
                    description: '',
                    websiteUrl: '',
                    createdAt: 89,
                    isMembership: true,
                })
                .expect(HttpStatus.BadRequest);

        expect(invalidDataSet2.body.errorMessages).toHaveLength(5);

        const invalidDataSet3 =
            await request(app)
                .post(BLOGS_PATH)
                .set('Authorization', adminToken)
                .send({
                    name: 'A' //short
                })
                .expect(HttpStatus.BadRequest);

        expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

        // check что никто не создался
        const blogListResponse =
            await request(app)
                .get(BLOGS_PATH)
                .set('Authorization', adminToken);

        expect(blogListResponse.body).toHaveLength(0);

    })

    it('❌ should not update blog when incorrect data passed; PUT /api/blogs/:id', async () => {

        const createdBlog = await createBlog(app, correctTestBlogData)

            await request(app)
                .put(`${BLOGS_PATH}/ ${createdBlog.id}`)
                .set('Authorization', adminToken)
                .send({
                    name: '    ',
                    description: '      ',
                    websiteUrl: 'Invalid Url',
                    createdAt: '12',
                    isMembership: true,
                })
                .expect(HttpStatus.BadRequest);


        const blogResponse =
            await getBlogById(app, createdBlog.id)
        
        expect(blogResponse).toEqual({
         ...createdBlog
        });
    });

})