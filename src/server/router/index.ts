// src/server/router/index.ts
import { createRouter } from "./trpcContext";
import superjson from "superjson";

import { chatMessagesRouter } from "./chatRouter";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("chatMessagesRouter.", chatMessagesRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
