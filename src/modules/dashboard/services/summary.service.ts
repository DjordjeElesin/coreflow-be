import prisma from "@/config/database";
import { OrderStatus, Role } from "@/config/generated/enums";
import { TAuthUser } from "@/types";
import { add, startOfMonth, sub } from "date-fns";

export const getSummary = async (currentUser: TAuthUser) => {
  const isPrivileged =
    currentUser.role === Role.ADMIN || currentUser.role === Role.MODERATOR;

  const startOfThisMonth = startOfMonth(new Date()).toISOString();
  const startOfNextMonth = add(startOfThisMonth, { months: 1 }).toISOString();
  const startOfLastMonth = sub(startOfThisMonth, { months: 1 }).toISOString();

  const [currentMonthRevenue, lastMonthRevenue, employeesByContractType] =
    isPrivileged
      ? await Promise.all([
          prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: {
              createdAt: { gte: startOfThisMonth, lt: startOfNextMonth },
              status: {
                in: [
                  OrderStatus.CONFIRMED,
                  OrderStatus.SHIPPED,
                  OrderStatus.DELIVERED,
                ],
              },
            },
          }),
          prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: {
              createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
              status: {
                in: [
                  OrderStatus.CONFIRMED,
                  OrderStatus.SHIPPED,
                  OrderStatus.DELIVERED,
                ],
              },
            },
          }),
          prisma.employee.groupBy({
            by: ["contractType"],
            _count: true,
          }),
        ])
      : [null, null, null];

  const revenue = currentMonthRevenue?._sum.totalAmount ?? 0;
  const lastRevenue = lastMonthRevenue?._sum.totalAmount ?? 0;
  const momGrowth =
    lastRevenue === 0 ? null : ((revenue - lastRevenue) / lastRevenue) * 100;

  const [openOrders, leaveBalance, lowStockProducts] = await Promise.all([
    prisma.order.findMany({
      where: {
        status: { in: [OrderStatus.DRAFT, OrderStatus.CONFIRMED] },
      },
      select: { id: true, orderNumber: true, updatedAt: true },
    }),
    prisma.employee.findFirst({
      where: { id: currentUser.id },
      select: { leaveBalance: true },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 20 } },
      orderBy: { stock: "asc" },
    }),
  ]);

  return {
    openOrders,
    leaveBalance,
    lowStockProducts,
    ...(isPrivileged
      ? {
          revenue: {
            currentMonth: revenue,
            difference: momGrowth,
          },
          employeesByContractType: employeesByContractType?.map(
            ({ _count, contractType }) => ({
              contractType,
              count: _count,
            }),
          ),
        }
      : {}),
  };
};
