import {useEffect} from "react";
import {useUserStore,} from "../utils/stores";
import {RoomsList} from "../components/roomsList";
import {useSession} from "next-auth/react";
import {RoomControlSection} from "./components/roomControlSection";

export default function Index() {
    const session = useSession();
    const currentUser = useUserStore((state) => state.user);
    const setCurrentUser = useUserStore((state) => state.setUser);

    const {username, setUsername} = useUserStore((state) => {
        return {
            username: state.anonymousUser.username,
            setUsername: (newUsername) => alert("NOT IMPLEMENTED YET"),
        };
    });

    // TODO: create new component for logging (similar to the 9anime)
    useEffect(() => {
        const userNow = session?.data?.user;

        if (!currentUser && userNow) {
            setCurrentUser({
                ...userNow
            })
        }
    }, [])

    // HOOKS SECTION END

    if (!currentUser && session && session?.status != "loading" && session.status == "authenticated") {
        const user = session.data?.user;

        if (!user) {
            return <div>Loading...</div>;
        }
    }

    return (
        <div className="flex flex-col flex-1 justify-start mt-12 items-center">
            <div className="flex flex-col items-center mb-4">
                <RoomControlSection
                    username={username}
                    setUsername={setUsername}
                    session={session}
                />
            </div>
            <RoomsList/>
            <span className="mt-4 bg-red-900"/>
        </div>
    );
}
