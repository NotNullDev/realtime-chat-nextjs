import {signIn, signOut, useSession} from "next-auth/react";
import Link from "next/link";

import {useEffect, useState} from "react";
import {useRouter} from "next/router";
// @ts-ignore
import {GetServerSideProps} from "next";
import {useUserStore} from "../utils/stores";

function AccountComponent({
                              session,
                              csrfToken,
                              callbackUri,
                          }: {
    session: ReturnType<typeof useSession>;
    csrfToken: string;
    callbackUri: string;
}) {
    const unAuthUser = useUserStore(state => state.anonymousUser);

    return (
        <div className="flex flex-row-reverse p-2 w-full m10-5">
            {session?.status === "unauthenticated" && (
                <>
                    <div className="mr-3">
                        {/* <Link href="/login"> */}
                        <button
                            className="btn btn-ghost"
                            onClick={() =>
                                signIn("google", {
                                    redirect: true,
                                    callbackUrl: "/",
                                })
                            }
                        >
                            Sign in
                        </button>
                        {/* </Link> */}
                    </div>
                </>
            )}
            {session?.status === "authenticated" && (
                <button
                    className="btn btn-ghost"
                    onClick={() =>
                        signOut({
                            callbackUrl: "/",
                            redirect: true,
                        })
                    }
                >
                    Sign out
                </button>
            )}

            {session?.status === "authenticated" && session.data.user && (
                <div className="m-2 whitespace-nowrap mr-5">
                    {session?.data.user?.name}
                </div>
            )}

            {(!session || session?.status !== "authenticated") && (
                <div className="flex items-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision"
                         textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd"
                         clipRule="evenodd" viewBox="0 0 511 512.35"
                         width="2rem"
                    >
                        <path
                            d="M162.62 21.9c-5.49 5.43-10.63 12.02-15.42 19.71-17.37 27.82-30.33 69.99-39.92 123.16-56.3 10.64-91.06 34.14-89.9 58.14 1.04 21.74 28.46 38.41 69.67 49.92-2.71 8.38-2.07 9.82 1.6 20.13-30.78 12.98-62.94 52.4-88.65 86.93l100.03 67.61-35.32 64.85h384.41l-37.26-64.85L511 378.63c-29.08-40.85-64.19-75.56-86.12-84.98 4.63-12.02 5.44-14.12 1.56-20.79 41.21-11.72 68.23-28.84 68.17-51.47-.06-24.68-35.5-48.38-88.31-56.62-12.64-53.5-25.22-95.62-41.23-123.27-2.91-5.02-5.93-9.57-9.09-13.62-47.66-61.12-64.36-2.69-98.14-2.76-39.17-.08-44.15-53.69-95.22-3.22zm67.12 398.37c-3.57 0-6.47-2.9-6.47-6.47s2.9-6.47 6.47-6.47h10.52c1.38 0 2.66.44 3.7 1.17 3.77 2.1 7.46 3.33 11.01 3.42 3.54.09 7.14-.96 10.8-3.45a6.515 6.515 0 0 1 3.61-1.11l12.78-.03c3.57 0 6.46 2.9 6.46 6.47s-2.89 6.47-6.46 6.47h-10.95c-5.46 3.27-10.98 4.67-16.54 4.53-5.44-.14-10.78-1.77-16.01-4.53h-8.92zm-69.12-140.78c60.43 21.74 120.87 21.38 181.3 1.83-58.45 4.75-122.79 3.62-181.3-1.83zm208.37-.86c20.89 70.63-68.53 106.5-101.95 27.98h-22.11c-34.12 78.28-122.14 44.17-102.16-28.94-7.31-.8-14.51-1.68-21.56-2.62l-.32 1.88-.59 3.56-3.48 20.87c-30.39-6.72-13.36 71.77 14.26 64.87 4.22 12.18 7.69 22.62 11.26 32.19 36.81 98.83 190.88 104.81 226.95 6.36 3.78-10.32 6.85-21.64 11.24-35.39 25.44 4.06 46.35-73.31 15.34-67.63l-3.19-21.05-.55-3.65-.23-1.54c-7.47 1.16-15.12 2.2-22.91 3.11zM123.7 176.34l7.43-25.43c48.16 40.42 214.59 34.09 250.87 0l6.26 25.43c-42.31 44.75-219.33 38.67-264.56 0z"/>
                    </svg>
                    <div className="m-2 whitespace-nowrap text-center">
                        {unAuthUser?.username}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision"
                         textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd"
                         clipRule="evenodd" viewBox="0 0 511 512.35"
                         width="2rem"
                    >
                        <path
                            d="M162.62 21.9c-5.49 5.43-10.63 12.02-15.42 19.71-17.37 27.82-30.33 69.99-39.92 123.16-56.3 10.64-91.06 34.14-89.9 58.14 1.04 21.74 28.46 38.41 69.67 49.92-2.71 8.38-2.07 9.82 1.6 20.13-30.78 12.98-62.94 52.4-88.65 86.93l100.03 67.61-35.32 64.85h384.41l-37.26-64.85L511 378.63c-29.08-40.85-64.19-75.56-86.12-84.98 4.63-12.02 5.44-14.12 1.56-20.79 41.21-11.72 68.23-28.84 68.17-51.47-.06-24.68-35.5-48.38-88.31-56.62-12.64-53.5-25.22-95.62-41.23-123.27-2.91-5.02-5.93-9.57-9.09-13.62-47.66-61.12-64.36-2.69-98.14-2.76-39.17-.08-44.15-53.69-95.22-3.22zm67.12 398.37c-3.57 0-6.47-2.9-6.47-6.47s2.9-6.47 6.47-6.47h10.52c1.38 0 2.66.44 3.7 1.17 3.77 2.1 7.46 3.33 11.01 3.42 3.54.09 7.14-.96 10.8-3.45a6.515 6.515 0 0 1 3.61-1.11l12.78-.03c3.57 0 6.46 2.9 6.46 6.47s-2.89 6.47-6.46 6.47h-10.95c-5.46 3.27-10.98 4.67-16.54 4.53-5.44-.14-10.78-1.77-16.01-4.53h-8.92zm-69.12-140.78c60.43 21.74 120.87 21.38 181.3 1.83-58.45 4.75-122.79 3.62-181.3-1.83zm208.37-.86c20.89 70.63-68.53 106.5-101.95 27.98h-22.11c-34.12 78.28-122.14 44.17-102.16-28.94-7.31-.8-14.51-1.68-21.56-2.62l-.32 1.88-.59 3.56-3.48 20.87c-30.39-6.72-13.36 71.77 14.26 64.87 4.22 12.18 7.69 22.62 11.26 32.19 36.81 98.83 190.88 104.81 226.95 6.36 3.78-10.32 6.85-21.64 11.24-35.39 25.44 4.06 46.35-73.31 15.34-67.63l-3.19-21.05-.55-3.65-.23-1.54c-7.47 1.16-15.12 2.2-22.91 3.11zM123.7 176.34l7.43-25.43c48.16 40.42 214.59 34.09 250.87 0l6.26 25.43c-42.31 44.75-219.33 38.67-264.56 0z"/>
                    </svg>
                </div>
            )}

        </div>
    );
}

export default function AppHeaderComponent({csrfToken}) {
    const session = useSession();
    const router = useRouter();

    const [theme, setTheme] = useState("dark");

    const toggleTheme = () => {
        let newTheme = theme === "dark" ? "aqua" : "dark";
        document.querySelector("html")?.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
    };

    useEffect(() => {
        let savedTheme = localStorage.getItem("theme");

        if (!savedTheme) {
            savedTheme = "dark";
        }
        localStorage.setItem("theme", savedTheme);
        document.querySelector("html")?.setAttribute("data-theme", savedTheme);
        setTheme(savedTheme);
    }, []);

    return (
        <>
            <div className="navbar bg-base-100 w-full flex justify-between">
                <Link href="/">
                    <a className="btn btn-ghost normal-case text-xl">Chat</a>
                </Link>
                <AccountComponent
                    session={session}
                    csrfToken={csrfToken}
                    callbackUri="/api/auth/signin/google"
                />
                <div className="flex flex-row-reverse">
                    <label className="swap swap-rotate mr-3">
                        <input type="checkbox" onChange={() => toggleTheme()}/>

                        <svg
                            className="swap-on fill-current w-7 h-7"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
                        </svg>

                        <svg
                            className="swap-off fill-current w-7 h-7"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
                        </svg>
                    </label>
                </div>
            </div>
        </>
    );
    [];
}
