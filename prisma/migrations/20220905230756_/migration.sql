-- CreateTable
CREATE TABLE `UserRoomAuthReq` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `roomId` BIGINT NOT NULL,
    `userId` VARCHAR(384) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserRoomAuthReq_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
