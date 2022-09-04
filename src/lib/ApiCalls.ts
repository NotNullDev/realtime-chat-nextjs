export const getAllRoomsQuery = async () => {
    const response = await fetch("api/getAllRooms");

    return await response.json();
}