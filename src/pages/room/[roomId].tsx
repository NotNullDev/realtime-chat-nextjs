import {useSession} from "next-auth/react";
import {ChatComponent} from "../../components/ChatComponent";
import {useRouter} from "next/router";

export const RoomPage = () => {
    const {data: session, status} = useSession();

    const router = useRouter();

    if (status === "loading" ) {
        return <div>Loading...</div>;
    }

    if (!session) {
        router.push("/login");
        return <div className="flex1 items-center justify-center">
            <div>Loading...</div>
        </div>
    }

    return (
        <main className="grid place-items-center flex-1">
            <div className="flex w-[60vw] min-w-[550px]  h-full m-0 px-16  ">
                <div className="flex-[1] p-4">
                    <ChatComponent />
                </div>
            </div>
        </main>
    );

}

export default RoomPage;