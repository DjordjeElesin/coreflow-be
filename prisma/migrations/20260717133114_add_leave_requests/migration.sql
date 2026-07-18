-- CreateEnum
CREATE TYPE "LeaveRequestType" AS ENUM ('VACATION', 'SICK', 'MATERNITY', 'UNPAID');

-- CreateEnum
CREATE TYPE "LeaveRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "lastLeaveResetYear" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "birthDate" SET DATA TYPE DATE;

-- CreateTable
CREATE TABLE "leave_requests" (
    "id" SERIAL NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "leaveType" "LeaveRequestType" NOT NULL,
    "status" "LeaveRequestStatus" NOT NULL,
    "reason" TEXT,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
