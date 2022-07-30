-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(384) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `authorId` VARCHAR(384) NOT NULL DEFAULT 'NOT_ASSIGNED',
    `content` VARCHAR(384) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `clientUUID` VARCHAR(384) NOT NULL,

    UNIQUE INDEX `Message_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(384) NOT NULL,
    `userId` VARCHAR(384) NOT NULL,
    `type` VARCHAR(384) NOT NULL,
    `provider` VARCHAR(384) NOT NULL,
    `providerAccountId` VARCHAR(384) NOT NULL,
    `refresh_token` VARCHAR(384) NULL,
    `access_token` VARCHAR(384) NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(384) NULL,
    `scope` VARCHAR(384) NULL,
    `id_token` VARCHAR(10000) NULL,
    `session_state` VARCHAR(384) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(384) NOT NULL,
    `sessionToken` VARCHAR(384) NOT NULL,
    `userId` VARCHAR(384) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(384) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(384) NULL,
    `channelId` VARCHAR(384) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(384) NOT NULL,
    `token` VARCHAR(384) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RoleToUser` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_RoleToUser_AB_unique`(`A`, `B`),
    INDEX `_RoleToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
