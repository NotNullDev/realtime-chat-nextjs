import {Excalidraw} from "@excalidraw/excalidraw";
import {useEffect, useState} from "react";

export default function EmbeddedExcalidraw () {

    const [ExcalidrawComponent, setExcalidraw] = useState<typeof  Excalidraw | null>(null);

    useEffect(() => {
        import("@excalidraw/excalidraw").then((comp) => {
            setExcalidraw(comp.Excalidraw);
        })
    }, []);


    return <div className="w-full h-full">
        { ExcalidrawComponent &&
            <ExcalidrawComponent
                theme="dark"
                detectScroll={true}
                gridModeEnabled={true}
            />
        }
        { !ExcalidrawComponent && <div>Loading canvas...</div> }
    </div>;
}