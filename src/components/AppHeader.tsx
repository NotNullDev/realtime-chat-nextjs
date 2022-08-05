import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getBaseUrl } from "../pages/_app";
// @ts-ignore
import { GetServerSideProps } from "next";
import {Session} from "next-auth";

function AccountComponent(session: { data: Session; status: "authenticated" } | { data: null; status: "unauthenticated" | "loading" } | { readonly data: null; readonly status: "loading" }, csrfToken, callbackUri: string) {
  return <div className="flex flex-row-reverse p-2 w-full m10-5">
    {session?.status === "unauthenticated" && (
        <form method="POST" action="/api/auth/signin/google">
          <input type="hidden" name="csrfToken" value={csrfToken}/>
          <input type="hidden" name="callbackUri" value={callbackUri}/>
          <button
              className="border-black border rounded p-2 px-4"
              type="submit"
          >
            Sign in
          </button>
        </form>
    )}
    {session?.status === "authenticated" && (
        <button
            className="border-black border rounded p-2 px-4"
            onClick={() => signOut()}
        >
          Sign out
        </button>
    )}
    {session?.status === "authenticated" && session.data.user && (
        <div className="m-2 whitespace-nowrap mr-5">
          Welcome back, {session?.data.user?.name}
        </div>
    )}
  </div>;
}

export default function AppHeaderComponent({ csrfToken }) {
  const session = useSession();
  const router = useRouter();

  const [theme, setTheme] = useState("dark");

  const callbackUri = getBaseUrl();

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

  const handleSignIn = () => {
    router.push("/api/auth/signin/google");
  };

  return (
    <>
      <div className="navbar bg-base-100 w-full flex justify-between">
        <Link href="/">
          <a className="btn btn-ghost normal-case text-xl">Chat</a>
        </Link>
        <div className="flex flex-row-reverse">
          <div className="mx-5" onClick={() => toggleTheme()}>
            {theme === "dark" ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                  <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                  />
                </svg>
            )}
          </div>
        </div>
      </div>
    </>
  );
[]}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken();

  return {
    props: {
      csrfToken,
    },
  };
};
