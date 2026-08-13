/*
  Warnings:

  - You are about to drop the column `approvedBy` on the `leave_requests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "leave_requests" DROP CONSTRAINT "leave_requests_approvedBy_fkey";

-- AlterTable
ALTER TABLE "leave_requests" DROP COLUMN "approvedBy",
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" INTEGER;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
