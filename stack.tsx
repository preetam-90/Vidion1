import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  // Add base URL to help with image proxying
  baseUrl: process.env.NEXT_PUBLIC_STACK_API_URL || "https://api.stack-auth.com",
});
