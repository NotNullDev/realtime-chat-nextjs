import {useEffect, useRef, useState} from "react";
import {useAnonymousUserStore} from "../utils/stores";
import Link from "next/link";
import {RightSideBar} from "../components/rightSideBar";

export interface ActiveChannel {
    channelName: string;
    activeUsers: number;
}

export const SinglePublicChannelPreview = ({channelName, activeUsers}: { channelName: string, activeUsers: number }) => {
    return (
        <div className="bg-base-300 m-1 p-3 rounded-2xl flex flex-col w-48
            hover:bg-base-100
            transition
            ease-in  duration-300
            hover:scale-105
            ">
            <p>{channelName}</p>
            <div className="flex justify-between mt-2">
                <div className="btn btn-primary btn-sm">Join</div>
                <div className="mr-4 flex justify-center items-center">
                    <div>{activeUsers}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20"
                         fill="currentColor">
                        <path
                            d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}

function JoinRoomModalBody( {createRoom} ) {

    return (
        <>
        <h1 className="mb-3">Enter provided private room key</h1>

        <input className="input input-bordered" placeholder="Room key"/>

        <div className="flex -mt-3">
            <button className="modal-action" onClick={() => createRoom()}>
                <label htmlFor="my-modal" className="btn btn-success mr-2">Join</label>
            </button>
            <button className="modal-action">
                <label htmlFor="my-modal" className="btn btn-error">Cancel</label>
            </button>
        </div>
    </>);
}

function CreateRoomModalBody({title, setRoomName, createRoom}: { title: string, setRoomName: (value: (((prevState: string) => string) | string)) => void, createRoom: () => void }) {
    return <>
        <h1>{title}</h1>

        <input type="text" className="input input-bordered w-full max-w-xs mt-2"
               onChange={(e) => setRoomName(old => e.target.value)}/>
        <div className="flex -mt-3">
            <button className="modal-action" onClick={() => createRoom()}>
                <label htmlFor="my-modal" className="btn btn-success mr-2">Create</label>
            </button>
            <button className="modal-action">
                <label htmlFor="my-modal" className="btn btn-error">Cancel</label>
            </button>
        </div>
    </>;
}

function ChangeNameModalBody({username, setUsername}) {

    const inputRef = useRef<HTMLInputElement>(null);

    return <>
        <h1>Change your name</h1>

        <input type="text" className="input input-bordered w-full max-w-xs mt-2" ref={inputRef}/>
        <div className="flex -mt-3">
            <button className="modal-action">
                <label htmlFor="my-modal" className="btn btn-success mr-2" onClick={() => setUsername(inputRef.current?.value ?? "ERROR")}>Change</label>
            </button>
            <button className="modal-action">
                <label htmlFor="my-modal" className="btn btn-error">Cancel</label>
            </button>
        </div>
    </>;
}

const ButtonGroup = (
    {
        activeChannels,
        username,
        setUsername,
    }
) => {


    const [roomName, setRoomName] = useState("Pogaduszki");

    const toggleElement = useRef<HTMLInputElement>(null);

    const [isPrivate, setIsPrivate] = useState(false);

    const [modalBody, setModalBody] = useState("changeName");

    const title = isPrivate ? "Private room name" : "Public room name";

    const [tempUsername, setTempUsername] = useState(username);

    const onKeyDownListener = (e) => {
        if (e.key === "Escape" && toggleElement.current) {
            toggleElement.current.checked = false;
        } else if (e.key === "Enter" && toggleElement.current) {
            toggleElement.current.checked = false;
            console.log("Created room");
        }
    }

    const updateUsername = (e) => {
        setUsername(tempUsername);
    }

    // Global key listeners
    useEffect(() => {
        console.log("Adding key listener");
        document.onkeydown = onKeyDownListener;

        return () => {
            document.removeEventListener("keydown", onKeyDownListener)
            console.log('removed key listener');
        };
    });



    const openModal = (isPrivate) => {
        setIsPrivate(isPrivate);

        if (isPrivate) {
            setModalBody("private");
        } else {
            setModalBody("public");
        }

        if (toggleElement.current) {
            toggleElement.current.checked = true;
        }
    }

    const openChangeNameModal = () => {
        setModalBody("changeName");
        if (toggleElement.current) {
            toggleElement.current.checked = true;
        }
    }

    const openJoinModal = () => {
        setModalBody("join");
        if (toggleElement.current) {
            toggleElement.current.checked = true;
        }
    }

    const createRoom = () => {
        console.log(`${isPrivate ? "Private" : "Public"} room ${roomName} created`);
    }

    return (
        <>
            <div className="flex mb-2">
                <span className="mr-2">Your nickname: <strong>{username}</strong></span>

                <button onClick={() => openChangeNameModal()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/>
                        <path fillRule="evenodd"
                              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                              clipRule="evenodd"/>
                    </svg>
                </button>
            </div>

            <div className="flex">
                <div className="flex">
                    <Link href={"/room"}>
                        <div className="btn m-2">Join random room</div>
                    </Link>
                    <div className="btn m-2" onClick={() => openJoinModal()}>Join private room</div>
                    <div className="flex">
                        <div className="btn m-2 modal-button" onClick={() => openModal(false)}>
                            Create public room
                        </div>
                        <div className="btn m-2" onClick={() => openModal(true)}>Create private room</div>
                    </div>
                </div>

                {/*New room modal*/}
                <input type="checkbox" id="my-modal" className="modal-toggle" ref={toggleElement}/>
                <div className="modal">
                    <div className="modal-box flex flex-col items-center justify-center">
                        {
                            modalBody === "join" && <JoinRoomModalBody createRoom={createRoom} />
                        }
                        {
                            (modalBody === "public" || modalBody === "private") && <CreateRoomModalBody  title={title} createRoom={createRoom} setRoomName={setRoomName}  />
                        }
                        {
                            modalBody === "changeName" && <ChangeNameModalBody username={username} setUsername={setUsername}/>
                        }
                    </div>
                </div>
                {/*New room modal*/}

            </div>
        </>);
}

export default function Index() {
    const activeChannels: ActiveChannel[] = [
        {
            channelName: "Pogaduszki",
            activeUsers: 35
        },
        {
            channelName: "takie tam",
            activeUsers: 15
        },
        {
            channelName: "wisielec",
            activeUsers: 10
        },
        {
            channelName: "Pogaduszki",
            activeUsers: 35
        },
        {
            channelName: "takie tam",
            activeUsers: 15
        },
        {
            channelName: "wisielec",
            activeUsers: 10
        },
        {
            channelName: "Pogaduszki",
            activeUsers: 35
        },
        {
            channelName: "takie tam",
            activeUsers: 15
        },
        {
            channelName: "wisielec",
            activeUsers: 10
        },
    ];

    const {username, setUsername}    = useAnonymousUserStore(state => {
        return {
            username: state.username,
            setUsername: state.setUsername
        }
    });

    return <div className="flex flex-col flex-1 justify-start mt-12 items-center">
        <div className="flex flex-col items-center mb-4">
            <ButtonGroup activeChannels={activeChannels} username={username} setUsername={setUsername}/>
        </div>
        <RightSideBar activeChannels={activeChannels}/>
        <span className="mt-4 bg-red-900"/>
    </div>
}