import CenterComponent from "../components/Center";

export const ErrorPage = () => {
    return <CenterComponent className="font-bold text-4xl">

        <div className="flex flex-col justify-center items-center">
            <div className="mb-3">404</div>
            <div>Page not found</div>
        </div>
    </CenterComponent>
}

export default ErrorPage;