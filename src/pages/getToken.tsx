import {useRef} from "react";
import {useQuery} from "@tanstack/react-query";
import CenterComponent from "../components/Center";

const GetTokenPage = ({}) => {
    const tokenSpan = useRef<HTMLSpanElement | undefined>(undefined);
    const getTokenQuery = useQuery(["getToken"], getTokenApiCall, {
        refetchOnMount: false,
    })

    let tokenValue = "";

    switch (getTokenQuery.status) {
        case "loading":
            tokenValue = "Loading...";
            break;
        case "success":
            tokenValue = getTokenQuery.data;
            break;
        case "error":
            tokenValue = getTokenQuery.error.toString();
            break;
        default:
            tokenValue = "Error!";
    }

    return (
        <CenterComponent className="flex flex-col">
            <h1 className="mb-3">Token: <span ref={tokenSpan}>{tokenValue}</span></h1>
            <button className="btn btn-primary">Generate</button>
        </CenterComponent>
    );
}

export default GetTokenPage;

const getTokenApiCall = async () => {
    const response = await fetch("/api/joinRoom", {
        method: "POST",
        body: JSON.stringify({
            roomId: "1"
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw (await response.json()).error;
    }

    return (await response.json()).secret;
}