/*
  Warnings:

  - You are about to drop the column `name` on the `customers` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'LEAD', 'BLOCKED');

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "name",
ADD COLUMN     "birthDate" DATE,
ADD COLUMN     "company" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "CustomerStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "type" "CustomerType" NOT NULL DEFAULT 'INDIVIDUAL';
