export const NewRoomModalComponent = ({chatName, setChatName, isPrivate}) => {

    const title = isPrivate ? "Create private room" : "Create public room";

    return (
        <>
            <label htmlFor="my-modal" className="btn modal-button">open modal</label>

            <input type="checkbox" id="my-modal" className="modal-toggle"/>
            <div className="modal">
                <div className="modal-box flex flex-col items-center justify-center">

                    <h1>{title}</h1>

                    <input type="text" className="input input-bordered w-full max-w-xs mt-2"
                           onChange={(e) => setChatName(old => e.target.value)}/>

                    <div className="flex -mt-3">
                        <div className="modal-action">
                            <label htmlFor="my-modal" className="btn btn-success mr-2">Create</label>
                        </div>
                        <div className="modal-action">
                            <label htmlFor="my-modal" className="btn btn-error">Cancel</label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )


}

export default NewRoomModalComponent;