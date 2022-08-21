import {User} from "@prisma/client";

export function joinRandomRoom(user: User) {

}

export function joinPrivateRoom(privateRoomCode: string) {}

export async function createPublicRoom(roomName: string, owner: User, isPrivate: boolean) {
  // const firstRoom: Room | null | undefined = await prisma?.room.findFirst({
  //   include:{
  //     activeUsers: true,
  //     admins: true
  //   }
  // });
  prisma?.room.findFirst({
    select: {
      name: true
    },
    where: {
      name: roomName
    }
  });

  prisma?.room.create({
    data: {
      ownerId: owner.id,
      name: roomName,
      isPrivate
    }

  });

}

/** Returns privateRoomKey */
export function createPrivateRoom(roomName: string, owner: User): string {

  return "";
}
