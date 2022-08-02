const SinglePublicChannelPreview = ({channelName, activeUsers}: { channelName: string, activeUsers: number }) => {
    return (
        <div className="bg-base-300 m-2 p-3 card flex flex-col">
            <p>{channelName}</p>
            <div className="place-self-end mr-4">{activeUsers}</div>
        </div>
    );
}

const RightSideBar = () => {

    const activeChannels = [
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
    ]

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

const ButtonGroup = () => {
    return (<div className="flex">
        <div className="flex flex-col">
            <div className="btn m-2">Join random room</div>
            <div className="btn m-2">Join private room</div>
        </div>
        <div className="flex flex-col">
            <div className="btn m-2">Create public room</div>
            <div className="btn m-2">Create private room</div>
        </div>
    </div>);
}


export default function Index() {
    return <div className="flex flex-1 justify-center mt-12">
        <div className="flex flex-col items-center">
            <NickNameComponent/>
            <div className="mt-2"></div>
            <ButtonGroup/>
        </div>
        <div className="mr-4"></div>
        <RightSideBar/>
        <span className="mt-4 bg-red-900"/>
    </div>
}