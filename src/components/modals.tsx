import {useRef, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {usePathManager} from "../utils/hooks";
import {ChatRoom} from "../types/prisma";
import {session} from "next-auth/core/routes";
import {useSession} from "next-auth/react";
import {RandomRoomResponse} from "../types/appTypes";

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

    return await createRoomPromise.json() as RandomRoomResponse;
}

export function CreateRoomModalBody({}) {
    const [currentRoomName, setCurrentRoomName] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const {data: session, status } = useSession();

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

    const createRoom = () => {
        if (!session.user) {
            console.error("Current user is not authenticated!");
            return;
        }

        // create regex that passes alfabetic characters and following signs: _ - = @ , . ;
        const roomNameRegex = /^[a-zA-Z0-9_\-=@,.;]+$/;

        if (!roomName.current.match(roomNameRegex) || roomName.current.startsWith("private-")) {
            console.log("Invalid room name", roomName.current);
            return;
        }

        createRoomMutation.mutate({
            ownerId: session.user.id,
            roomName: roomName.current,
            isPrivate: isPrivate
        }, {
            onSuccess: async (data) => {
                console.log("Create room success", data);

                if (data.error) {
                    console.error("OMG SOMETHING IS REALY OFF");
                    return;
                }
                await queryClient.invalidateQueries(["chatMessagesRouter.getAllRooms"]);
                await roomManager.pushToRoom(data.room as ChatRoom);
            },
            onError: err => {
                console.error("Something went wrong", err);
            }
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

export function ChangeNameModalBody() {
    const inputRef = useRef<HTMLInputElement>(null);

    const setUsername = (anyVal: any) => {
        alert("Not implemented yet");
    };

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