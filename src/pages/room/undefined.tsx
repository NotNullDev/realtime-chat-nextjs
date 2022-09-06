import {useRouter} from "next/router";
import {useEffect} from "react";

const UndefinedPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push("/");
    }, []);

    return <div>It should not happen...</div>
}

export default UndefinedPage;