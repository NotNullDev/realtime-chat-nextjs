import {signIn, signOut, useSession} from "next-auth/react";

export default function AppHeaderComponent() {

    const {data: session, status} = useSession();

    return (
        <>
            <div className="p-2 border-b w-full grid place-items-center">
                {
                    !session && (
                        <button className="border-black border rounded p-2 px-4" onClick={() => signIn()}>Sign in</button>
                    )
                }
                {
                    session?.user && (
                        <button className="border-black border rounded p-2 px-4" onClick={() => signOut()}>Sign out</button>
                    )
                }
            </div>
            {
                session?.user &&(
                    <div className="m-2" >Hello {session?.user?.name}</div>
                )
            }
        </>
    );
}