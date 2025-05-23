import {setupApp} from "../../../src/setupApp";
import express from "express";
import {generateAdminAuthToken} from "../../utils/generateAdminAuthToken";
import {runDB, stopDb} from "../../../src/db/mongoDb";
import {clearDb} from "../../utils/clearDb";
import request from "supertest";
import {POSTS_PATH} from "../../../src/core/paths/paths";
import {HttpStatus} from "../../../src/core/types/httpStatus";
import {ResourceType} from "../../../src/core/types/resourceType";


describe('Posts API body validation check', () => {
    const app = express();
    setupApp(app);

    const adminToken = generateAdminAuthToken();

    beforeAll(async () => {
        await runDB('mongodb://localhost:27017/test');
        await clearDb(app);
    });
    afterAll(async () => {
        await stopDb();
    });

    it('should not create post when incorrect body passed; POST /api/posts', async () => {
       await request(app)
           .post(POSTS_PATH)
           .send({})
           .expect(HttpStatus.Unauthorized);

       // const invalidDataSet1 =
       //     await request(app)
       //         .post(POSTS_PATH)
       //         .set("Authorization", adminToken)
       //         .send({
       //             data: {
       //                 type: ResourceType.Post,
       //                 attributes: {
       //                     title: "   ",
        //                    shortDescription: "",
        //                    content: "",
        //                    blogId: true
        //                },
        //            },
        //        })
        //        .expect(HttpStatus.BadRequest);
        // console.log(invalidDataSet1.body.errors);
        //
        // expect(invalidDataSet1.body.errors).toHaveLength(4);

       const invalidDataSet2 =
           await request(app)
               .post(POSTS_PATH)
               .set("Authorization", adminToken)
               .send({
                   data: {
                       type: ResourceType.Post,

                       attributes: {
                           title: 21,
                           shortDescription: "   ",
                           content: "2vgg",
                           blogId: true
                       },
                   },
               })
               .expect(HttpStatus.BadRequest);
        console.log(invalidDataSet2.body.errors);
        expect(invalidDataSet2.body.errors).toHaveLength(3);

        const postListResponse =
            await request(app)
                .get(POSTS_PATH)
                .set("Authorization", adminToken);

        expect(postListResponse.body.data).toHaveLength(0);
    });


})