import {useRef} from "react";
import {SinglePublicChannelPreview} from "../pages";
import {ChatRoom} from "../types/prisma";

export const RightSideBar = ({activeChannels}: { activeChannels: ChatRoom[] }) => {

    const searchBarRef = useRef<HTMLInputElement>(null);

    const toggleSearchBar = () => {
        searchBarRef.current?.classList.toggle("hidden");
    }

    return (
        <div
            className="flex flex-col items-center card bg-base-200 w-[60vw] h-[60vh] shadow-2xl border border-black p-6 h-min overflow-y-auto min-w-[370px]">

            <div className="flex  justify-end items-start relative w-full px-10 py-4 mb-2">
                <h2 className="text-center mb-3 -mt-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Active
                    public channels</h2>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 justify-self-end" viewBox="0 0 20 20"
                         fill="currentColor" onClick={() => toggleSearchBar()}>
                        <path fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"/>
                    </svg>
                </button>
            </div>

            <div className="flex items-center justify-center w-full mb-5" ref={searchBarRef}>
                {/* TODO: Add fade animation */}
                <input className="p-3 w-64 input input-bordered transition-transform duration-300 m"
                       placeholder="Search..."/>
                <div className="ml-12">
                    Filter options (categories) (TODO)
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-center min-w-[320px]">
                {
                    activeChannels.map((activeChannel, index) => {
                        return (<SinglePublicChannelPreview key={index} channelName={activeChannel.name}
                                                           room={activeChannel}
                        />);
                    })
                }
            </div>
        </div>);
}