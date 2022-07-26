// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import {websocketRouter} from "./myWsChat";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("wsClient",  websocketRouter );

// export type definition of API
export type AppRouter = typeof appRouter;
