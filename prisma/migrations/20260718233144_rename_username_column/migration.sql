-- Rename column `userName` -> `username` while preserving existing data.
-- (A drop+add would lose the 21 existing values; RENAME keeps them.)
ALTER TABLE "users" RENAME COLUMN "userName" TO "username";

-- Keep the unique index name consistent with Prisma's naming convention.
ALTER INDEX "users_userName_key" RENAME TO "users_username_key";
