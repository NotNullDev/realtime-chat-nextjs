import {useRef, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {usePathManager} from "../utils/hooks";
import {useUserStore} from "../utils/stores";
import {ChatRoom} from "../types/prisma";

export function JoinRoomModalBody() {
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

const createRoomQuery = async ({
                                   ownerId,
                                   roomName,
                                   isPrivate
                               }: { ownerId: string, roomName: string, isPrivate: boolean }) => {
    const createRoomPromise = await fetch("http://localhost:3000/api/createRoom", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ownerId,
            roomName,
            isPrivate
        })
    });

    return createRoomPromise.json();
}

export function CreateRoomModalBody({}) {
    const [currentRoomName, setCurrentRoomName] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const createRoomMutation = useMutation(["createRoom"], createRoomQuery, {
        onSuccess: data => {
            console.log("Create room success", data);
        },
        onError: err => {
            console.error("Something went wrong", err);
        }
    });

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

        if (!roomName.current.match(roomNameRegex) || roomName.current.startsWith("private-")) {
            console.log("Invalid room name");
            return;
        }

        createRoomMutation.mutate({
            ownerId: currentUser.id,
            roomName: roomName.current,
            isPrivate: isPrivate
        }, {
            onSuccess: async (data) => {
                console.log("Create room success", data);
                data = data as ChatRoom;
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

export function ChangeNameModalBody({username, setUsername}) {
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