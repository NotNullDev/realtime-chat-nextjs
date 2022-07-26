import { signIn, signOut, useSession } from "next-auth/react";

export default function AppHeaderComponent() {

  const session = useSession();

  return (
    <>
      <div className="navbar bg-base-100 w-full flex justify-between">
        <a className="btn btn-ghost normal-case text-xl">Chat</a>

        <div className="flex flex-row-reverse">
          <div className="p-2 w-full grid place-items-center">
            {session?.status === 'unauthenticated' && (
              <button
                className="border-black border rounded p-2 px-4"
                onClick={() => signIn()}
              >
                Sign in
              </button>
            )}
            {session?.status === 'authenticated' && (
              <button
                className="border-black border rounded p-2 px-4"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            )}
          </div>
          {session?.status === 'authenticated'&& session.data.user && (
            <div className="m-2 whitespace-nowrap">
              Welcome back, {session?.data.user?.name}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
