-- CreateTable
CREATE TABLE `rule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `days` JSON NOT NULL,
    `start_time` INTEGER NOT NULL,
    `end_time` INTEGER NOT NULL,
    `navs` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
