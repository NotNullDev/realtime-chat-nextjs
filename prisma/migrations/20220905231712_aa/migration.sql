/*
  Warnings:

  - Added the required column `secret` to the `UserRoomAuthReq` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserRoomAuthReq` ADD COLUMN `secret` VARCHAR(384) NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
