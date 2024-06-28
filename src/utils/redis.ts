import Redis from "ioredis";

require("dotenv").config();

const redisClient = () => {
    if (process.env.REDIS_URI) {
        console.log(`Redis is connected`);
        return process.env.REDIS_URI
    }

    throw new Error("Redis connection is failed");
}

export const redis = new Redis(redisClient());