import type {AppType} from "next/dist/shared/lib/utils";
import "../styles/globals.css";
import {getCsrfToken, SessionProvider} from "next-auth/react";
import AppHeader from "../components/AppHeader";
// @ts-ignore
import {GetServerSideProps} from "next";
import {QueryClientProvider, useQueryClient} from "@tanstack/react-query";
import queryClient from "../utils/queryClient";

// @ts-ignore
BigInt.prototype.toJSON = function () {
    return this.toString()
}

export let appWs: WebSocket | null = null;

export let numberOfRenders = 0;
numberOfRenders++;

const MyApp: AppType = ({Component, pageProps}) => {

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider session={pageProps.session} refetchInterval={0}>
                <div className="w-full mx-auto flex flex-col min-h-screen">
                    <AppHeader csrfToken={pageProps.csrfToken}/>
                    <Component {...pageProps} />
                    {/*<AppFooter />*/}
                </div>
                {/*<ReactQueryDevtools initialIsOpen={true} position="bottom-left" />*/}
            </SessionProvider>
        </QueryClientProvider>
    );
};

export const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return "";
    }
    if (process.browser) return ""; // Browser should use current path
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const csrfToken = await getCsrfToken();

    return {
        props: {
            csrfToken,
        },
    };
};

export default MyApp;