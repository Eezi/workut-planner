import { ConvexHttpClient } from "convex/browser";
import { env } from "../../env/server.mjs";

console.log("env.NEXT_PUBLIC_CONVEX_URL", env.NEXT_PUBLIC_CONVEX_URL);
export const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);
