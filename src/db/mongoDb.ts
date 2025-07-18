import { Collection, Db, MongoClient } from "mongodb";
import { Blog } from "../blogs/domain/blog";
import { SETTINGS } from "../core/settings/settings";
import { Post } from "../posts/domain/post";
import { User } from "../users/domain/user";
import { Comments } from "../comments/domain/comment";

const BLOG_COLLECTION_NAME = "blogs";
const POST_COLLECTION_NAME = "posts";
const USER_COLLECTION_NAME = "users";
const COMMENTS_COLLECTION_NAME = "comments";

export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
export let commentCollection: Collection<Comments>;

//Подключение к бд
export async function runDB(url: string): Promise<void> {
  client = await MongoClient.connect(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  //Инициализация коллекций
  blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<Post>(POST_COLLECTION_NAME);
  userCollection = db.collection<User>(USER_COLLECTION_NAME);
  commentCollection = db.collection<Comments>(COMMENTS_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("✅ Connected to the database");
    // Создаём уникальные индексы для пользователей

    await userCollection.createIndex({ login: 1 }, { unique: true });
    await userCollection.createIndex({ email: 1 }, { unique: true });
    console.log("✅ Unique indexes for login and email created");
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

//для тестов
export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
}
