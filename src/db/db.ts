import { PrismaClient } from "@prisma/client";

// Mock data for when DATABASE_URL is not available (like in Vercel preview deployments)
const mockProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    priceInCents: 99900,
    filePath: "/mock/iphone.pdf",
    imagePath: "/mock/iphone.jpg",
    description: "Latest iPhone with advanced features",
    category: "Phones",
    isAvailableForPurchase: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    orders: [],
    _count: { orders: 5 },
  },
  {
    id: "2",
    name: "MacBook Pro M3",
    priceInCents: 199900,
    filePath: "/mock/macbook.pdf",
    imagePath: "/mock/macbook.jpg",
    description: "Powerful laptop for professionals",
    category: "Laptops",
    isAvailableForPurchase: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    orders: [],
    _count: { orders: 3 },
  },
];

// Mock database client for when DATABASE_URL is missing
const createMockClient = () => ({
  product: {
    findMany: async () => mockProducts,
    findUnique: async () => mockProducts[0] || null,
    count: async () => mockProducts.length,
    create: async () => mockProducts[0],
    update: async () => mockProducts[0],
    delete: async () => mockProducts[0],
  },
  user: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => null,
    update: async () => null,
    delete: async () => null,
  },
  order: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
  },
  downloadVerification: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async () => null,
    update: async () => null,
    delete: async () => null,
  },
});

const prismaClientSingleton = () => {
  // Check if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not found. Using mock database for deployment.");
    return createMockClient() as any;
  }

  try {
    return new PrismaClient();
  } catch (error) {
    console.warn(
      "Failed to initialize Prisma client. Using mock database.",
      error
    );
    return createMockClient() as any;
  }
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
