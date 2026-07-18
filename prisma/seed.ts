import "../src/config/env";
import bcrypt from "bcrypt";
import prisma from "../src/config/database";
import {
  ContractType,
  Gender,
  LeaveRequestStatus,
  LeaveRequestType,
} from "../src/config/generated/client";
import { EmployeeCreateNestedOneWithoutLeaveRequestsInput } from "../src/config/generated/models";
import { startOfYear, endOfYear, addDays, isAfter } from "date-fns";

type DummyCategory = { slug: string; name: string };

type DummyProduct = {
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  sku: string;
  images: string[];
  thumbnail: string;
  category: string;
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
  meta: { barcode: string; qrCode: string };
};

type DummyUser = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  image: string;
  gender: string;
  birthDate: string;
  university: string;
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  company: {
    department: string;
    title: string;
  };
};

const CONTRACT_TYPES: ContractType[] = [
  ContractType.FULL_TIME,
  ContractType.PART_TIME,
  ContractType.CONTRACT,
  ContractType.INTERN,
];

const LEAVE_TYPE: LeaveRequestType[] = [
  LeaveRequestType.VACATION,
  LeaveRequestType.SICK,
  LeaveRequestType.MATERNITY,
  LeaveRequestType.UNPAID,
];

const LEAVE_STATUS: LeaveRequestStatus[] = [
  LeaveRequestStatus.APPROVED,
  LeaveRequestStatus.PENDING,
  LeaveRequestStatus.REJECTED,
];

const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomDateInYear = (year: number) => {
  const start = startOfYear(new Date(year, 0, 1)).getTime(); // milliseconds
  const end = endOfYear(new Date(year, 0, 1)).getTime(); // milliseconds
  const randomMs = Math.floor(Math.random() * (end - start + 1)) + start;
  return new Date(randomMs);
};

const mapGender = (gender: string): Gender => {
  if (gender.toLowerCase() === "male") return Gender.MALE;
  if (gender.toLowerCase() === "female") return Gender.FEMALE;
  return Gender.OTHER;
};

const seedAdminUser = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@coreflow.com" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "Coreflow",
      email: "admin@coreflow.com",
      username: "admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(
    "Seeded admin user (email: admin@coreflow.com, password: admin123)",
  );
};

const seedEmployees = async () => {
  const res = await fetch("https://dummyjson.com/users");
  const { users }: { users: DummyUser[] } = await res.json();

  const departmentNames = [...new Set(users.map((u) => u.company.department))];
  const positionNames = [...new Set(users.map((u) => u.company.title))];

  const departmentMap: Record<string, number> = {};
  for (const name of departmentNames) {
    const dept = await prisma.department.create({
      data: { name, description: `${name} Department` },
    });
    departmentMap[name] = dept.id;
  }

  const positionMap: Record<string, number> = {};
  for (const name of positionNames) {
    const pos = await prisma.position.create({ data: { name } });
    positionMap[name] = pos.id;
  }

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const address = await prisma.address.create({
      data: {
        street: user.address.address,
        city: user.address.city,
        state: user.address.state,
        country: user.address.country,
        postalCode: user.address.postalCode,
        lat: user.address.coordinates.lat,
        lng: user.address.coordinates.lng,
      },
    });

    const createdUser = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        password: hashedPassword,
        phone: user.phone,
        profileImage: user.image,
        gender: mapGender(user.gender),
        birthDate: new Date(user.birthDate),
        education: user.university,
        role: "USER",
        addressId: address.id,
      },
    });

    await prisma.employee.create({
      data: {
        id: createdUser.id,
        departmentId: departmentMap[user.company.department],
        positionId: positionMap[user.company.title],
        contractType: randomItem(CONTRACT_TYPES),
        salary: randomBetween(700, 7000),
        leaveBalance: randomBetween(10, 30),
      },
    });
  }

  console.log(`Seeded ${users.length} employees`);
};

const seedCategories = async (): Promise<Record<string, number>> => {
  const res = await fetch("https://dummyjson.com/products/categories");
  const categories: DummyCategory[] = await res.json();

  const categoryMap: Record<string, number> = {};

  for (const cat of categories) {
    const created = await prisma.productCategory.create({
      data: { name: cat.name },
    });
    categoryMap[cat.slug] = created.id;
  }

  console.log(`Seeded ${categories.length} categories`);
  return categoryMap;
};

const seedProducts = async (categoryMap: Record<string, number>) => {
  const res = await fetch("https://dummyjson.com/products?limit=194");
  const { products }: { products: DummyProduct[] } = await res.json();

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.title,
        description: product.description,
        price: product.price,
        discountPercentage: product.discountPercentage,
        rating: product.rating,
        stock: product.stock,
        brand: product.brand ?? "Unknown",
        sku: product.sku,
        images: product.images,
        thumbnail: product.thumbnail,
        barCode: product.meta?.barcode ?? "",
        qrCode: product.meta?.qrCode ?? "",
        warrantyInformation: product.warrantyInformation ?? "",
        shippingInformation: product.shippingInformation ?? "",
        returnPolicy: product.returnPolicy ?? "",
        categoryId: categoryMap[product.category],
      },
    });
  }

  console.log(`Seeded ${products.length} products`);
};

const seedLeaveRequest = async () => {
  const employees = await prisma.employee.findMany();

  for (let i = 0; i < 10; i++) {
    const randomEmployee = randomItem(employees);
    const randomYear = randomItem([2026, 2025, 2024, 2023, 2022]);
    const startDate = randomDateInYear(randomYear);
    const endDate = addDays(startDate, randomBetween(1, 10));
    const today = new Date();

    await prisma.leaveRequest.create({
      data: {
        startDate,
        endDate,
        employeeId: randomEmployee.id,
        leaveType: randomItem(LEAVE_TYPE),
        status: isAfter(endDate, today)
          ? randomItem(LEAVE_STATUS)
          : randomItem([
              LeaveRequestStatus.APPROVED,
              LeaveRequestStatus.REJECTED,
            ]),
      },
    });
  }
};

const main = async () => {
  await prisma.leaveRequest.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();
  await prisma.address.deleteMany();
  await prisma.department.deleteMany();
  await prisma.position.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();

  await seedAdminUser();
  await seedEmployees();
  await seedLeaveRequest();

  const categoryMap = await seedCategories();
  await seedProducts(categoryMap);

  console.log("Database seeded successfully");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
