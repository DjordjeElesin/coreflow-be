import prisma from "@/config/database";
import {
  TBaseKpiParams,
  TRevenueTrendParams,
} from "../validation/dashboard.validation";
import {
  differenceInDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import { Prisma } from "@/config/generated/client";
import { TAuthUser } from "@/types";

export const getTopProducts = async ({
  categoryId,
  startDate,
  endDate,
}: TBaseKpiParams & { categoryId?: number }) => {
  const currentMonthStart = startOfMonth(new Date()).toISOString();
  const currentMonthEnd = endOfMonth(new Date()).toISOString();

  const groupedProducts = await prisma.orderItem.groupBy({
    take: 10,
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    where: {
      ...(categoryId ? { product: { categoryId } } : {}),
      order: {
        createdAt: {
          gte: startDate ?? currentMonthStart,
          lte: endDate ?? currentMonthEnd,
        },
      },
    },
  });

  const productIds = groupedProducts.map(({ productId }) => productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      thumbnail: true,
      price: true,
      category: true,
    },
  });

  const productById = new Map(products.map((p) => [p.id, p]));

  return groupedProducts.map(({ productId, _sum }) => ({
    ...productById.get(productId),
    totalQuantity: _sum.quantity ?? 0,
  }));
};

export const getTopCustomers = async ({
  startDate,
  endDate,
}: TBaseKpiParams) => {
  const currentMonthStart = startOfMonth(new Date()).toISOString();
  const currentMonthEnd = endOfMonth(new Date()).toISOString();

  const groupedCustomers = await prisma.order.groupBy({
    by: ["customerId"],
    take: 10,
    _sum: { totalAmount: true },
    _count: { id: true },
    orderBy: { _sum: { totalAmount: "desc" } },
    where: {
      createdAt: {
        gte: startDate ?? currentMonthStart,
        lte: endDate ?? currentMonthEnd,
      },
    },
  });

  const customerIds = groupedCustomers.map(({ customerId }) => customerId);

  const customers = await prisma.customer.findMany({
    where: { id: { in: customerIds } },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      company: true,
    },
  });

  const customersById = new Map(customers.map((c) => [c.id, c]));

  return groupedCustomers.map(({ customerId, _sum, _count }) => ({
    ...customersById.get(customerId),
    totalSpent: _sum.totalAmount,
    numberOfOrders: _count.id,
  }));
};

type TRevenueRow = { date: Date; revenue: number };

export const getRevenueTrend = async ({
  startDate,
  endDate,
  categoryId,
}: TRevenueTrendParams) => {
  const getGranularity = () => {
    if (!startDate || !endDate) return "week";
    const difference = differenceInDays(new Date(endDate), new Date(startDate));
    if (difference <= 31) return "day";
    if (difference > 31 && difference <= 120) return "week";
    if (difference > 120) return "month";
    return "week";
  };
  const granularity = getGranularity();
  const start = startDate ?? subMonths(new Date(), 6).toISOString();
  const end = endDate ?? new Date().toISOString();

  const revenueCalculation = categoryId
    ? Prisma.sql`SUM(oi."lineTotal")`
    : Prisma.sql`SUM(o."totalAmount")`;

  const categoryJoin = categoryId
    ? Prisma.sql`JOIN order_items oi ON oi."orderId" = o.id
                 JOIN products p ON p.id = oi."productId"`
    : Prisma.empty;

  const categoryFilter = categoryId
    ? Prisma.sql`AND p."categoryId" = ${categoryId}`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<TRevenueRow[]>`
    SELECT date_trunc(${granularity}, o."createdAt") AS date, ${revenueCalculation} AS revenue
    FROM orders o
    ${categoryJoin}
    WHERE o."createdAt" BETWEEN ${start} AND ${end}
      AND o.status IN (${Prisma.join(["CONFIRMED", "SHIPPED", "DELIVERED"])})
      ${categoryFilter}
    GROUP BY date
    ORDER BY date`;

  const bucketKey = (date: Date) =>
    format(date, granularity === "month" ? "yyyy-MM" : "yyyy-MM-dd");
  const revenueByBucket = new Map(
    rows.map(({ date, revenue }) => [bucketKey(date), Number(revenue)]),
  );

  const range = { start: new Date(start), end: new Date(end) };
  const axis =
    granularity === "day"
      ? eachDayOfInterval(range)
      : granularity === "week"
        ? eachWeekOfInterval(range, { weekStartsOn: 1 })
        : eachMonthOfInterval(range);

  return axis.map((bucket) => ({
    date: bucket,
    revenue: revenueByBucket.get(bucketKey(bucket)) ?? 0,
  }));
};
