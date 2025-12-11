import { Redis } from "@upstash/redis";

export default async function handler(req, res) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const hasUsed = await redis.get(`user:${userId}:hasUsedCalculator`);

  return res.status(200).json({ hasUsed: hasUsed === "true" });
}
