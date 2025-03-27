import config from "@repo/config";
import { createClient, RedisClientType } from "redis";

const client = await createClient({ url: config.REDIS_CONNECTION_STRING })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

export const redisClient = client as RedisClientType;
