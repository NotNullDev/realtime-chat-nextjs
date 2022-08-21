import {useRouter} from "next/router";
import CenterComponent from "../../components/Center";

export const RoomPage = () => {
    const router = useRouter();

    const {roomId}  = router.query;

    return <CenterComponent>{roomId}</CenterComponent>

}

export default RoomPage;