import prisma from "@/config/database";

export const findAllUsers = async () =>
  prisma.user.findMany({ where: { deletedAt: null } });
