import { createWSClient, wsLink } from '@trpc/client/links/wsLink';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import {createTRPCClient} from "@trpc/client";
import {AppRouter} from "../server/router";

// create persistent WebSocket connection
const wsClient = createWSClient({
    url: `ws://localhost:3001`,
});

// configure TRPCClient to use WebSockets transport
export const client = createTRPCClient<AppRouter>({
    links: [
        wsLink({
            client: wsClient,
        }),
    ],
});

