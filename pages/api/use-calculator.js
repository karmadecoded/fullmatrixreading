import { Redis } from "@upstash/redis";

export default async function handler(req, res) {
  const redis = new Redis({
    url: process.env.kv_KV_REST_API_URL,
    token: process.env.kv_KV_REST_API_TOKEN,
  });

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const hasUsed = await redis.get(`user:${userId}:hasUsedCalculator`);

  return res.status(200).json({ hasUsed: hasUsed === "true" });
}
