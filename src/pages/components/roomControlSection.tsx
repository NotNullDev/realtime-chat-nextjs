import {ChatRoom} from "../../types/prisma";
import {useSession} from "next-auth/react";
import {useEffect, useRef, useState} from "react";
import {usePathManager} from "../../utils/hooks";
import {useQuery} from "@tanstack/react-query";
import {ChangeNameModalBody, CreateRoomModalBody, JoinRoomModalBody} from "../../components/modals";
import {RandomRoomResponse} from "../../types/appTypes";


export const RoomControlSection = () => {
    const {data: session, status} = useSession();
    const toggleElement = useRef<HTMLInputElement>(null);
    const [modalBody, setModalBody] = useState("changeName");
    const roomManager = usePathManager();

    const randomRoom = useQuery(["getRandomRoom"], getRandomRoomQuery, {});

    // Global key listeners
    useEffect(() => {
        document.onkeydown = onKeyDownListener;

        return () => {
            document.removeEventListener("keydown", onKeyDownListener);
        };
    }, []);

    // END HOOKS
    const onKeyDownListener = (e) => {
        if (e.key === "Escape" && toggleElement.current) {
            toggleElement.current.checked = false;
        } else if (e.key === "Enter" && toggleElement.current) {
            toggleElement.current.checked = false;
            console.log("Created room");
        }
    };

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
            await roomManager.pushToRoom(randomRoom.data.room);
        } else {
            alert("Error: randomRoom is null.");
        }
    };

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    const userInactiveClass = session?.user ? `disabled` : ``;

    let randomRoomNotExistClass = 'btn-disabled';

    if (randomRoom.status === "success" && !randomRoom.data.error) {
        randomRoomNotExistClass = '';
    }

    return (
        <>
            <div className="flex mb-2">
        <span className="mr-2">
          Your nickname: <strong>{session?.user.name ?? "IDK"}</strong>
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
                    <button className={`btn m-2 ${randomRoomNotExistClass}`} onClick={() => joinRandomRoom()}>
                        Join random room
                    </button>
                    <div className="btn m-2" onClick={() => openJoinModal()}>
                        Join private room
                    </div>
                    <button className={`btn m-2 modal-button ${userInactiveClass}`} onClick={() => openModal()}
                            disabled={status !== "authenticated"}
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
                            <ChangeNameModalBody/>
                        )}
                    </div>
                </div>
                {/*New room modal*/}
            </div>
        </>
    )
        ;
};
export const getRandomRoomQuery = async () => {
    const response = await fetch("/api/getRandomRoom");
    return await response.json() as RandomRoomResponse;
}