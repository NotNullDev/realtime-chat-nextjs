import type {AppType} from "next/dist/shared/lib/utils";
import "../styles/globals.css";
import {getCsrfToken, SessionProvider} from "next-auth/react";
// @ts-ignore
import {GetServerSideProps} from "next";
import queryClient from "../utils/queryClient";

import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {MantineProvider} from "@mantine/core";
import HeaderResponsive from "../components/MantineHeader";

// @ts-ignore
BigInt.prototype.toJSON = function () {
    return this.toString()
}

export let appWs: WebSocket | null = null;

export let numberOfRenders = 0;
numberOfRenders++;

const providersWrapper = ({children}) => {
    return <></>
}

const MyApp: AppType = ({Component, pageProps}) => {
    return (
        <MantineProvider theme={{colorScheme: 'dark'}} withGlobalStyles withNormalizeCSS>
            <QueryClientProvider client={queryClient}>
                <SessionProvider session={pageProps.session} refetchInterval={0}>
                    <div className="w-full mx-auto flex flex-col min-h-screen">
                        {/*<AppHeader csrfToken={pageProps.csrfToken}/>*/}
                        <HeaderResponsive links={[
                            {label: "Home", link: "/"},
                            {label: "Rooms", link: "/rooms"},
                            {label: "Login", link: "/login"},
                            {label: "Register", link: "/register"},
                        ]}/>
                        <div className="flex-1 p-4">
                            <Component {...pageProps} />
                        </div>
                        {/*<AppFooter />*/}
                    </div>
                    <ReactQueryDevtools initialIsOpen={true} position="bottom-left"/>
                </SessionProvider>
            </QueryClientProvider>
        </MantineProvider>
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