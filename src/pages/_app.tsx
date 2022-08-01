// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import {ReactQueryDevtools} from "react-query/devtools";

export let appWs: WebSocket | null = null;

// if (!appWs && typeof window !== "undefined") {
//     appWs = new WebSocket(`ws://localhost:3333`);
//     appWs.addEventListener('open', () => {
//     console.log('appWs is open');
//   });
// }

export let numberOfRenders = 0;
numberOfRenders++;

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <div className="w-full mx-auto flex flex-col min-h-screen">
        <AppHeader />
        <Component {...pageProps} />
        {/*<AppFooter />*/}
      </div>
      {/*<ReactQueryDevtools initialIsOpen={true} position="bottom-left" />*/}
    </SessionProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.browser) return ""; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
