import { Redis } from "@upstash/redis";

export default async function handler(req, res) {
  const redis = new Redis({
    url: process.env.kv_KV_REST_API_URL,
    token: process.env.kv_KV_REST_API_TOKEN,
  });

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, calculationData } = req.body;

  if (!userId || !calculationData) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  // Save calculation and mark as used
  await redis.set(`user:${userId}:hasUsedCalculator`, "true");
  await redis.set(`user:${userId}:calculationData`, JSON.stringify(calculationData));

  return res.status(200).json({ success: true });
}
