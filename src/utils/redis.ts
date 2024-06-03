import Redis from "ioredis";

require("dotenv").config();

const redisClient = () => {
    if (process.env.REDIS_URI) {
        console.log(`Redis URI: ${process.env.REDIS_URI}`);
        return process.env.REDIS_URI;
    }

    throw new Error("REDIS_URI environment variable is not defined");
};

// Wrap the creation of the Redis client in a try-catch block to handle errors
let redis;
try {
    redis = new Redis(redisClient());
    // Handle potential connection errors
    redis.on("error", (err) => {
        console.error("Redis connection error:", err);
    });
} catch (error) {
    console.error("Error creating Redis client:", error);
    process.exit(1); // Exit the process with a non-zero status code
}

export default redis;
