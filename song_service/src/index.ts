import express from "express";
import dotenv from "dotenv";
import songRoutes from "./route.js";
import redis from "redis";
import cors from "cors";

dotenv.config();

export const redisClient = redis.createClient({
  password: process.env.REDIS_PW as string,
  socket: {
    host: "redis-11200.c245.us-east-1-3.ec2.cloud.redislabs.com",
    port: 11200,
  },
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to redis");
  })
  .catch(console.error);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", songRoutes);

const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
