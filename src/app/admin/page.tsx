import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatNumber, formatCurrency } from "@/lib/formatters";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { Product } from "@prisma/client";

async function getProductData() {
  const [activeCount, inactiveCount, pricing] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
    db.product.aggregate({ _avg: { priceInCents: true } }),
  ]);

  const avgPriceInCents = pricing._avg.priceInCents || 0;
  return { activeCount, inactiveCount, avgPriceInCents };
}

async function getCategoryDistribution() {
  // Group by category (Prisma groupBy not enabled for sqlite earlier versions; fallback manual)
  const products = await db.product.findMany({
    select: { category: true, isAvailableForPurchase: true },
  });
  const map: Record<string, { total: number; active: number }> = {};
  for (const p of products) {
    if (!map[p.category]) map[p.category] = { total: 0, active: 0 };
    map[p.category].total += 1;
    if (p.isAvailableForPurchase) map[p.category].active += 1;
  }
  const entries = Object.entries(map).map(([category, v]) => ({
    category,
    ...v,
  }));
  entries.sort((a, b) => b.total - a.total);
  return entries.slice(0, 6); // top 6 categories
}

async function getWeeklyAdds(weeks = 6) {
  const now = new Date();
  const earliest = new Date(now);
  earliest.setDate(now.getDate() - weeks * 7);
  const recent = await db.product.findMany({
    where: { createdAt: { gte: earliest } },
    select: { createdAt: true },
  });
  // Bucketize per week (ending at now)
  const buckets: { label: string; count: number }[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(now.getDate() - (i + 1) * 7);
    const end = new Date(now);
    end.setDate(now.getDate() - i * 7);
    const count = recent.filter(
      (p: { createdAt: Date }) => p.createdAt >= start && p.createdAt < end
    ).length;
    buckets.push({ label: `W-${weeks - i}`, count });
  }
  return buckets;
}

async function getPriceStats() {
  const products = await db.product.findMany({
    select: { priceInCents: true },
  });
  if (products.length === 0)
    return {
      min: 0,
      max: 0,
      median: 0,
      avg: 0,
      buckets: [] as { label: string; count: number }[],
    };
  const prices = products
    .map((p: { priceInCents: number }) => p.priceInCents)
    .sort((a: number, b: number) => a - b);
  const min = prices[0];
  const max = prices[prices.length - 1];
  const median =
    prices.length % 2 === 1
      ? prices[(prices.length - 1) / 2]
      : Math.round(
          (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
        );
  const avg = Math.round(
    prices.reduce((s: number, v: number) => s + v, 0) / prices.length
  );
  // 5 buckets histogram
  const bucketCount = 5;
  const span = Math.max(1, max - min);
  const size = span / bucketCount;
  const bucketsRaw: number[] = new Array(bucketCount).fill(0);
  for (const p of prices) {
    const idx = Math.min(bucketCount - 1, Math.floor((p - min) / size));
    bucketsRaw[idx]++;
  }
  const buckets = bucketsRaw.map((count, i) => {
    const start = min + i * size;
    const end = i === bucketCount - 1 ? max : min + (i + 1) * size;
    return {
      label: `${Math.round(start / 100)}k–${Math.round(end / 100)}k`,
      count,
    };
  });
  return { min, max, median, avg, buckets };
}

async function getRecentProducts(limit = 5) {
  return db.product.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      createdAt: true,
      isAvailableForPurchase: true,
    },
  });
}

async function getCategoryCoverage() {
  const products = await db.product.findMany({
    select: { category: true, isAvailableForPurchase: true },
  });
  if (products.length === 0)
    return { distinct: 0, activeCategories: 0, topShare: 0 };
  const map: Record<string, { total: number; active: number }> = {};
  for (const p of products) {
    if (!map[p.category]) map[p.category] = { total: 0, active: 0 };
    map[p.category].total++;
    if (p.isAvailableForPurchase) map[p.category].active++;
  }
  const entries = Object.values(map);
  const total = entries.reduce(
    (s: number, e: { total: number; active: number }) => s + e.total,
    0
  );
  const top = entries.reduce(
    (m: number, e: { total: number; active: number }) => Math.max(m, e.total),
    0
  );
  return {
    distinct: entries.length,
    activeCategories: entries.filter(
      (e: { total: number; active: number }) => e.active > 0
    ).length,
    topShare: total ? top / total : 0,
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const adminEmails = ["yasirukularathne1234@gmail.com"];
  const email = session?.user?.email ?? "";
  if (!session || !email || !adminEmails.includes(email)) {
    redirect("/login");
  }

  const [
    productData,
    categoryData,
    weeklyAdds,
    priceStats,
    recentProducts,
    categoryCoverage,
  ] = await Promise.all([
    getProductData(),
    getCategoryDistribution(),
    getWeeklyAdds(),
    getPriceStats(),
    getRecentProducts(),
    getCategoryCoverage(),
  ]);

  const total = productData.activeCount + productData.inactiveCount;
  return (
    <div className="py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      <DashboardCard
        title="Active Products"
        subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
        body={formatNumber(productData.activeCount)}
        icon={
          <span className="inline-block bg-gradient-to-r from-indigo-500 to-blue-500 p-3 rounded-full text-white shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"
              />
            </svg>
          </span>
        }
      />
      <DashboardCard
        title="Products Summary"
        subtitle={`${formatNumber(
          productData.activeCount
        )} Active / ${formatNumber(productData.inactiveCount)} Inactive`}
        body={`${formatNumber(total)} Total`}
        icon={
          <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full text-white shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7l9-4 9 4-9 4-9-4zm9 4l9-4v6l-9 4-9-4v-6m9 10v-6"
              />
            </svg>
          </span>
        }
      />
      <div className="md:col-span-2">
        <Card className="rounded-3xl shadow-xl border-0 bg-white/70 backdrop-blur-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-gray-900">
              Average Price
            </CardTitle>
            <CardDescription className="text-gray-500">
              Across all products (active & inactive)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {formatCurrency(Math.round(productData.avgPriceInCents || 0))}
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Graphs Section */}
      <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="rounded-3xl shadow-xl border-0 bg-white/70 backdrop-blur-lg relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-800">
              Active vs Inactive
            </CardTitle>
            <CardDescription className="text-xs">
              Availability share
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-center">
            <Donut
              active={productData.activeCount}
              inactive={productData.inactiveCount}
            />
          </CardContent>
        </Card>
        <Card className="rounded-3xl shadow-xl border-0 bg-white/70 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-800">
              Category Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Top categories (total vs active)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <CategoryBars data={categoryData} />
          </CardContent>
        </Card>
        <Card className="rounded-3xl shadow-xl border-0 bg-white/70 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-800">
              New Products (Last 6 Weeks)
            </CardTitle>
            <CardDescription className="text-xs">
              Weekly additions trend
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <WeeklySparkline data={weeklyAdds} />
          </CardContent>
        </Card>
      </div>
      {/* Advanced Summaries */}
      <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="rounded-3xl shadow-xl border-0 bg-white/70 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-800">
              Price Stats
            </CardTitle>
            <CardDescription className="text-xs">
              Min / Median / Max (LKR)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-2">
            <div className="text-[11px] uppercase tracking-wide text-gray-500 flex justify-between">
              <span>Min</span>
              <span>{formatCurrency(Math.round(priceStats.min))}</span>
            </div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 flex justify-between">
              <span>Median</span>
              <span>{formatCurrency(Math.round(priceStats.median))}</span>
            </div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 flex justify-between">
              <span>Max</span>
              <span>{formatCurrency(Math.round(priceStats.max))}</span>
            </div>
            <div className="mt-3">
              <Histogram data={priceStats.buckets} />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl shadow-xl border-0 bg-white/70 backdrop-blur-lg col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-800">
              Recent Products
            </CardTitle>
            <CardDescription className="text-xs">
              Latest additions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="divide-y divide-gray-200/70 text-sm">
              {recentProducts.length === 0 && (
                <li className="py-2 text-gray-500 text-xs">No products</li>
              )}
              {recentProducts.map(
                (p: {
                  id: string;
                  name: string;
                  createdAt: Date;
                  isAvailableForPurchase: boolean;
                }) => (
                  <li key={p.id} className="py-2 flex items-center gap-3">
                    <span
                      className={
                        "h-2.5 w-2.5 rounded-full " +
                        (p.isAvailableForPurchase
                          ? "bg-indigo-500"
                          : "bg-gray-300")
                      }
                    ></span>
                    <span className="flex-1 line-clamp-1 text-gray-800 font-medium">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-gray-400 tabular-nums">
                      {relativeTime(p.createdAt)}
                    </span>
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
        <Card className="rounded-3xl shadow-xl border-0 bg-white/70 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-800">
              Category Coverage
            </CardTitle>
            <CardDescription className="text-xs">
              Diversity snapshot
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-3">
            <div className="text-[11px] uppercase tracking-wide text-gray-500 flex justify-between">
              <span>Categories</span>
              <span>{formatNumber(categoryCoverage.distinct)}</span>
            </div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 flex justify-between">
              <span>Active Categories</span>
              <span>{formatNumber(categoryCoverage.activeCategories)}</span>
            </div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 flex justify-between">
              <span>Top Share</span>
              <span>{(categoryCoverage.topShare * 100).toFixed(0)}%</span>
            </div>
            <div className="mt-2">
              <CoverageBar share={categoryCoverage.topShare} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
  icon: React.ReactNode;
};

function DashboardCard({ title, subtitle, body, icon }: DashboardCardProps) {
  return (
    <Card className="rounded-3xl shadow-xl border-0 bg-white/70 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {icon}
        <div>
          <CardTitle className="text-lg font-bold text-gray-900">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {subtitle}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {body}
        </p>
      </CardContent>
    </Card>
  );
}

// ===== Visualization Components (simple SVG, no external deps) =====
function Donut({ active, inactive }: { active: number; inactive: number }) {
  const total = active + inactive || 1;
  const activePct = (active / total) * 100;
  const inactivePct = 100 - activePct;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const activeStroke = (activePct / 100) * circumference;
  return (
    <div className="relative w-40 h-40">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth="12"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="url(#gradDonut)"
          strokeWidth="12"
          strokeDasharray={`${activeStroke} ${circumference - activeStroke}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <defs>
          <linearGradient id="gradDonut" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-gray-800 text-sm font-semibold"
        >
          {activePct.toFixed(0)}%
        </text>
      </svg>
      <div className="absolute -bottom-2 left-0 right-0 flex justify-center gap-4 text-[10px] text-gray-600">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          Active
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-300" />
          Inactive
        </span>
      </div>
    </div>
  );
}

function CategoryBars({
  data,
}: {
  data: { category: string; total: number; active: number }[];
}) {
  if (data.length === 0)
    return <p className="text-xs text-gray-500">No data</p>;
  const max = Math.max(
    ...data.map(
      (d: { category: string; total: number; active: number }) => d.total
    ),
    1
  );
  return (
    <ul className="space-y-3">
      {data.map((d: { category: string; total: number; active: number }) => {
        const activePct = (d.active / d.total) * 100;
        const widthPct = (d.total / max) * 100;
        return (
          <li key={d.category} className="space-y-1">
            <div className="flex justify-between text-[11px] uppercase tracking-wide text-gray-500">
              <span>{d.category}</span>
              <span>
                {d.active}/{d.total}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden relative">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"
                style={{ width: `${widthPct}%`, opacity: 0.25 }}
              />
              <div
                className="absolute inset-y-0 left-0 bg-indigo-500"
                style={{ width: `${(d.active / max) * 100}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 bg-indigo-300"
                style={{
                  width: `${(d.active / max) * 100}%`,
                  mixBlendMode: "overlay" as any,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function WeeklySparkline({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  const max = Math.max(
    ...data.map((d: { label: string; count: number }) => d.count),
    1
  );
  const points = data
    .map((d: { label: string; count: number }, i: number) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.count / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <div>
      <div className="h-28 relative">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <polyline
            fill="none"
            stroke="url(#sparkGrad)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
          />
          <defs>
            <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - (d.count / max) * 100;
          return (
            <div
              key={d.label}
              className="absolute flex flex-col items-center"
              style={{ left: `calc(${x}% - 6px)`, top: `calc(${y}% - 6px)` }}
            >
              <div className="h-3 w-3 rounded-full bg-indigo-500 ring-2 ring-white shadow" />
            </div>
          );
        })}
      </div>
      <div className="mt-2 grid grid-cols-6 text-[10px] text-gray-500 font-medium tracking-wide">
        {data.map((d: { label: string; count: number }) => (
          <span key={d.label} className="text-center">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ===== Additional Visualization Components =====
function Histogram({ data }: { data: { label: string; count: number }[] }) {
  if (data.length === 0)
    return <p className="text-xs text-gray-500">No data</p>;
  const max = Math.max(
    ...data.map((d: { label: string; count: number }) => d.count),
    1
  );
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d: { label: string; count: number }) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-blue-500"
            style={{ height: `${(d.count / max) * 100}%` }}
          />
          <span className="text-[9px] leading-tight text-gray-400 font-medium rotate-[-30deg] origin-top">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function CoverageBar({ share }: { share: number }) {
  return (
    <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden relative">
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-indigo-500"
        style={{ width: `${Math.min(100, share * 100)}%` }}
      />
    </div>
  );
}

function relativeTime(date: Date) {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
}
