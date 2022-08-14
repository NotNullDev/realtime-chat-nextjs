import { User } from "@prisma/client";

export function joinRandomRoom(user: User) {}

export function joinPrivateRoom(privateRoomCode: string) {}

export function createPublicRoom(roomName: string, owner: User) {}

/** Returns privateRoomKey */
export function createPrivateRoom(roomName: string, owner: User): string {
  return "";
}
