import { Paper } from "@mantine/core";
import CenterComponent from "../components/Center";
import RoomsPreview from "../components/RoomsPreview";

const IndexPage = () => {
    return <div className="h-full flex flex-1">
        <CenterComponent className="h-full flex-1">
            {/*<RoomsPreview/>*/}
            <Paper withBorder className="rounded-2xl" shadow="md">
                <div className="w-[250px] h-[100px] rounded-2xl flex flex-col shadow-xl p-4" >
                    <div>Pogaduszki</div>
                    <div>Online: <span>2</span></div>
                </div>
            </Paper>
        </CenterComponent>
    </div>
}

export default IndexPage;