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
    findMany: async (args?: any) => {
      if (!args) return mockProducts;
      const { select, orderBy, where, take } = args;
      let items = [...mockProducts];
      if (where?.createdAt?.gte) {
        items = items.filter((p) => p.createdAt >= where.createdAt.gte);
      }
      if (typeof where?.isAvailableForPurchase === "boolean") {
        items = items.filter(
          (p) => p.isAvailableForPurchase === where.isAvailableForPurchase
        );
      }
      if (orderBy?.updatedAt === "desc") {
        items.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      }
      if (take) items = items.slice(0, take);
      if (select) {
        return items.map((p) => {
          const out: any = {};
          for (const key of Object.keys(select)) {
            if (key === "_count" && select._count?.orders) {
              out._count = { orders: p._count?.orders ?? 0 };
            } else if (select[key]) {
              out[key] = (p as any)[key];
            }
          }
          return out;
        });
      }
      return items;
    },
    findUnique: async (args?: any) => {
      if (!args?.where?.id) return mockProducts[0] || null;
      return mockProducts.find((p) => p.id === args.where.id) || null;
    },
    count: async (args?: any) => {
      if (!args?.where) return mockProducts.length;
      let items = [...mockProducts];
      if (typeof args.where.isAvailableForPurchase === "boolean") {
        items = items.filter(
          (p) => p.isAvailableForPurchase === args.where.isAvailableForPurchase
        );
      }
      return items.length;
    },
    aggregate: async (args?: any) => {
      const selectAvg = args?._avg?.priceInCents;
      const prices = mockProducts.map((p) => p.priceInCents);
      const avg = prices.length
        ? prices.reduce((a, b) => a + b, 0) / prices.length
        : 0;
      return {
        _avg: {
          priceInCents: selectAvg ? avg : null,
        },
      };
    },
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
