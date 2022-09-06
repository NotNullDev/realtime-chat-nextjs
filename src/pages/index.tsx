import {useEffect} from "react";
import {RoomsList} from "../components/roomsList";
import {useSession} from "next-auth/react";
import {RoomControlSection} from "./components/roomControlSection";

export default function Index() {

    return (
        <div className="flex flex-col flex-1 justify-start mt-12 items-center">
            <div className="flex flex-col items-center mb-4">
                <RoomControlSection />
            </div>
            <RoomsList/>
            <span className="mt-4 bg-red-900"/>
        </div>
    );
}
