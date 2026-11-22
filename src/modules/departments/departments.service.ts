import prisma from "@/config/database";

export const find = async () => prisma.department.findMany();
