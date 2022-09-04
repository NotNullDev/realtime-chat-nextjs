import {ChatRoom} from "../types/prisma";
import {usePathManager} from "../utils/hooks";

export const RoomCard = ({
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