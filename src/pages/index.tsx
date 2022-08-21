import {useEffect, useRef, useState} from "react";
import {useRoomStore, useUserStore,} from "../utils/stores";
import {RightSideBar} from "../components/rightSideBar";
import {trpc} from "../utils/trpc";
import {ChatRoom} from "../types/prisma";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {usePathManager} from "../utils/hooks";

export interface ActiveChannel {
    channelName: string;
    activeUsers: number;
}

export const SinglePublicChannelPreview = ({
                                               channelName,
                                               room
                                           }: {
    channelName: string;
    room: ChatRoom
}) => {

    const roomManager = usePathManager();

    const join = async () => {
        await roomManager.pushToRoom(room);
    }

    return (
        <div
            className="bg-base-300 m-1 p-3 rounded-2xl flex flex-col w-48
            hover:bg-base-100
            transition
            ease-in  duration-300
            hover:scale-105
            "
        >
            <p>{channelName}</p>
            <div className="flex justify-between mt-2">
                <div className="btn btn-primary btn-sm" onClick={() => join()}>Join</div>
                <div className="mr-4 flex justify-center items-center">
                    {
                        room.isPrivate
                        &&
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                  clipRule="evenodd"/>
                        </svg>
                    }
                    <div className="mx-3">{room.activeUsers.length}</div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

function JoinRoomModalBody() {
    const [currentSecretKey, setCurrentSecretKey] = useState<string>("");
    const secretKey = useRef<string>("");

    const joinRoom = () => {
    };

    return (
        <>
            <h1 className="mb-3">Enter provided private room key</h1>
            <div className="w-[70%]">
                <input
                    className="input input-bordered w-full"
                    placeholder="Room key"
                    autoFocus
                    value={secretKey.current}
                    onChange={(e) =>
                        setCurrentSecretKey((old) => {
                            secretKey.current = e.target.value;
                            return e.target.value;
                        })
                    }
                />

                <div className="flex place-self-start mt-3"></div>
            </div>
            <div className="flex -mt-3">
                <button className="modal-action" onClick={() => joinRoom()}>
                    <label htmlFor="my-modal" className="btn btn-success mr-2">
                        Create
                    </label>
                </button>
                <button className="modal-action">
                    <label htmlFor="my-modal" className="btn btn-error">
                        Cancel
                    </label>
                </button>
            </div>
        </>
    );
}

function CreateRoomModalBody({}) {
    const [currentRoomName, setCurrentRoomName] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const setCurrentRoom = useRoomStore(state => state.setCurrentRoom);
    const createRoomMutation = trpc.useMutation(["chatMessagesRouter.createRoom"])
    const queryClient = trpc.useContext();
    const router = useRouter();

    const roomManager = usePathManager();

    const roomName = useRef("");

    let currentUser = useUserStore((state) => state.user);

    const createRoom = () => {
        if (!currentUser) {
            alert("Current user is not defined.")
            return;
        }

        // create regex that passes alfabetic characters and following signs: _ - = @ , . ;
        const roomNameRegex = /^[a-zA-Z0-9_\-=@,.;]+$/;

        if (!roomName.current.match(roomNameRegex)) {
            console.log("Invalid room name");
            return;
        }

        createRoomMutation.mutate({
            ownerId: currentUser.id,
            roomName: roomName.current,
            isPrivate: isPrivate
        }, {
            onSuccess: async (data) => {
                data = data as ChatRoom;
                setCurrentRoom(data);
                await queryClient.invalidateQueries(["chatMessagesRouter.getAllRooms"]);
                await roomManager.pushToRoom(data as ChatRoom);
            },
        });
    };

    return (
        <>
            <h1>Create new room</h1>
            <div className="w-[70%]">
                <input
                    autoFocus
                    type="text"
                    className="input input-bordered w-full max-w-xs mt-2"
                    value={roomName.current}
                    onChange={(e) =>
                        setCurrentRoomName((old) => {
                            roomName.current = e.target.value;
                            return e.target.value;
                        })
                    }
                />
                <div className="flex place-self-start mt-3">
                    <input
                        id="is-private"
                        type="checkbox"
                        checked={isPrivate}
                        className="checkbox"
                        onChange={() => setIsPrivate((old) => !old)}
                    />
                    <label htmlFor="is-private" className="ml-2">
                        Private
                    </label>
                </div>
            </div>
            <div className="flex -mt-3">
                <button className="modal-action" onClick={() => createRoom()}>
                    <label htmlFor="my-modal" className="btn btn-success mr-2">
                        Create
                    </label>
                </button>
                <button className="modal-action">
                    <label htmlFor="my-modal" className="btn btn-error">
                        Cancel
                    </label>
                </button>
            </div>
        </>
    );
}

function ChangeNameModalBody({username, setUsername}) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <h1>Change your name</h1>

            <input
                type="text"
                className="input input-bordered w-full max-w-xs mt-2"
                ref={inputRef}
            />
            <div className="flex -mt-3">
                <button className="modal-action">
                    <label
                        htmlFor="my-modal"
                        className="btn btn-success mr-2"
                        onClick={() => setUsername(inputRef.current?.value ?? "ERROR")}
                    >
                        Change
                    </label>
                </button>
                <button className="modal-action">
                    <label htmlFor="my-modal" className="btn btn-error">
                        Cancel
                    </label>
                </button>
            </div>
        </>
    );
}


const ButtonGroup = ({
                         activeChannels,
                         username,
                         setUsername,
                         session
                     }: { activeChannels: ChatRoom[], username: string, setUsername: (string) => void, session: ReturnType<typeof useSession> }) => {
    const toggleElement = useRef<HTMLInputElement>(null);


    const [modalBody, setModalBody] = useState("changeName");

    const roomManager = usePathManager();

    const [tempUsername, setTempUsername] = useState(username);
    const randomRoom = trpc.useQuery(["chatMessagesRouter.getRandomRoom"]);

    const onKeyDownListener = (e) => {
        if (e.key === "Escape" && toggleElement.current) {
            toggleElement.current.checked = false;
        } else if (e.key === "Enter" && toggleElement.current) {
            toggleElement.current.checked = false;
            console.log("Created room");
        }
    };

    const updateUsername = (e) => {
        setUsername(tempUsername);
    };

    // Global key listeners
    useEffect(() => {
        document.onkeydown = onKeyDownListener;

        return () => {
            document.removeEventListener("keydown", onKeyDownListener);
        };
    });

    const openModal = () => {
        if (toggleElement.current) {
            setModalBody("newRoom");
            toggleElement.current.checked = true;
        }
    };

    const openChangeNameModal = () => {
        setModalBody("changeName");
        if (toggleElement.current) {
            toggleElement.current.checked = true;
        }
    };

    const openJoinModal = () => {
        setModalBody("join");
        if (toggleElement.current) {
            toggleElement.current.checked = true;
        }
    };

    const joinRandomRoom = async () => {
        if (randomRoom.status === "success" && randomRoom) {
            await roomManager.pushToRoom(randomRoom.data);
        } else {
            alert("Error: randomRoom is null.");
        }
    };

    let createNewRoomStyle = session.status === "authenticated" ? "" : "btn-disabled";

    return (
        <>
            <div className="flex mb-2">
        <span className="mr-2">
          Your nickname: <strong>{username}</strong>
        </span>

                <button onClick={() => openChangeNameModal()}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/>
                        <path
                            fillRule="evenodd"
                            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            <div className="flex">
                <div className="flex">
                    <div className="btn m-2" onClick={() => joinRandomRoom()}>
                        Join random room
                    </div>
                    <div className="btn m-2" onClick={() => openJoinModal()}>
                        Join private room
                    </div>
                    <button className="btn m-2 modal-button" onClick={() => openModal()}
                            disabled={session.status !== "authenticated"}
                    >
                        Create new Room
                    </button>
                </div>

                {/*New room modal*/}
                <input
                    type="checkbox"
                    id="my-modal"
                    className="modal-toggle"
                    ref={toggleElement}
                />
                <div className="modal">
                    <div className="modal-box flex flex-col items-center justify-center">
                        {modalBody === "join" && <JoinRoomModalBody/>}
                        {modalBody === "newRoom" && <CreateRoomModalBody/>}
                        {modalBody === "changeName" && (
                            <ChangeNameModalBody
                                username={username}
                                setUsername={setUsername}
                            />
                        )}
                    </div>
                </div>
                {/*New room modal*/}
            </div>
        </>
    )
        ;
};

export default function Index() {
    const session = useSession();

    const allRoomsQuery = trpc.useQuery(["chatMessagesRouter.getAllRooms"])

    const setCurrentRoom = useRoomStore((store) => store.setCurrentRoom);
    const currentUser = useUserStore((state) => state.user);
    const setCurrentUser = useUserStore((state) => state.setUser);

    const {username, setUsername} = useUserStore((state) => {
        return {
            username: state.anonymousUser.username,
            setUsername: (newUsername) => alert("NOT IMPLEMENTED YET"),
        };
    });

    trpc.useQuery(["chatMessagesRouter.getRandomRoom"]);

    useEffect(() => {
        const userNow = session?.data?.user;

        if (!currentUser && userNow) {
            setCurrentUser({
                ...userNow
            })
        }
    }, [])

    // HOOKS END

    if (!currentUser && session && session.status != "loading" && session.status == "authenticated") {

        const user = session.data?.user;

        if (!user) {
            return <div>Loading...</div>;
        }
    }

    if (allRoomsQuery.status === "loading") {
        return <div>Loading...</div>
    }

    if (allRoomsQuery.status === "error" || !allRoomsQuery.data) {
        return <div>Error</div>
    }

    return (
        <div className="flex flex-col flex-1 justify-start mt-12 items-center">
            <div className="flex flex-col items-center mb-4">
                <ButtonGroup
                    activeChannels={allRoomsQuery.data as ChatRoom[]}
                    username={username}
                    setUsername={setUsername}
                    session={session}
                />
            </div>
            <RightSideBar activeChannels={allRoomsQuery.data as ChatRoom[]}/>
            <span className="mt-4 bg-red-900"/>
        </div>
    );
}
