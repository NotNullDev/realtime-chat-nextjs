import {useRef, useState} from "react";
import {ampValidation} from "next/dist/build/output";

interface ActiveChannel {
    channelName: string;
    activeUsers: number;
}

const SinglePublicChannelPreview = ({channelName, activeUsers}: { channelName: string, activeUsers: number }) => {
    return (
        <div className="bg-base-300 m-1  p-3 card flex flex-col">
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

const RightSideBar = ({activeChannels}: {activeChannels: ActiveChannel[]}) => {
    return <div className="card bg-base-200 w-60 shadow-2xl border border-black p-6 h-min translate-x-1/2">
        <h2 className="text-center mb-2">Active public channels</h2>

        {
            activeChannels.map((activeChannel, index) => {
                return (<SinglePublicChannelPreview key={index} channelName={activeChannel.channelName}
                                                    activeUsers={activeChannel.activeUsers}/>);
            })
        }
    </div>
}

const NickNameComponent = () => {
    const nickname = "RandomBalunga35";

    return (
        <div><span>Your nickname: {nickname}</span></div>
    );
}

function joinRoomModalBody(title: string, setRoomName: (value: (((prevState: string) => string) | string)) => void, createRoom: () => void, activeChannels: ActiveChannel[]) {
    return <>
        <h1>Available rooms</h1>

        <ul className="menu bg-base-100 w-56 rounded-box">
            <li><a>Item 1</a></li>
            {
                activeChannels.map((activeChannel, index) => {
                    return (
                        <li key={index}><a>{activeChannel.channelName}</a></li>
                    )
                })
            }
        </ul>


        <button className="modal-action">
            <label htmlFor="my-modal" className="btn btn-error">Cancel</label>
        </button>
    </>;
}

function createRoomModalBody(title: string, setRoomName: (value: (((prevState: string) => string) | string)) => void, createRoom: () => void) {
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

const ButtonGroup = ({ activeChannels }) => {
    const [roomName, setRoomName] = useState("Pogaduszki");

    const toggleElement = useRef<HTMLInputElement>(null);

    const [isPrivate, setIsPrivate] = useState(false);

    const [isJoin, setIsJoin] = useState(false);

    const title = isPrivate ? "Private room name" : "Public room name";

    const openModal = (isPrivate) => {
        setIsPrivate(isPrivate);
        setIsJoin(false);

        if (toggleElement.current) {
            toggleElement.current.checked = !toggleElement.current.checked;
        }
    }

    const openJoinModal = () => {
        setIsJoin(true);
        if (toggleElement.current) {
            toggleElement.current.checked = !toggleElement.current.checked;
        }
    }

    const createRoom = () => {
        console.log(`${isPrivate ? "Private" : "Public"} room ${roomName} created`);
    }

    return (<div className="flex">
        <div className="flex flex-col">
            <div className="btn m-2">Join random room</div>
            <div className="btn m-2" onClick={() => openJoinModal()}>Join private room</div>
        </div>
        <div className="flex flex-col">
            <div className="btn m-2 modal-button" onClick={() => openModal(false)}>
                Create public room
            </div>
            <div className="btn m-2" onClick={() => openModal(true)}>Create private room</div>
        </div>

        {/*New room modal*/}
        <input type="checkbox" id="my-modal" className="modal-toggle" ref={toggleElement}/>
        <div className="modal">
            <div className="modal-box flex flex-col items-center justify-center">
                {
                    !isJoin
                    ? createRoomModalBody(title, setRoomName, createRoom)
                    : joinRoomModalBody(title, setRoomName, createRoom, activeChannels)
                }
            </div>
        </div>
        {/*New room modal*/}

    </div>);
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
        }
    ];

    return <div className="flex flex-1 justify-center mt-12">
        <div className="flex flex-col items-center">
            <NickNameComponent/>
            <div className="mt-2"></div>
            <ButtonGroup activeChannels={activeChannels} />
        </div>
        <div className="mr-4"></div>
        <RightSideBar activeChannels={activeChannels} />
        <span className="mt-4 bg-red-900"/>
    </div>
}