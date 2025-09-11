import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ActiveToggleDropdownItem,
  DeleteDropdownItem,
} from "./_components/ProductActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  const adminEmails = ["yasirukularathne1234@gmail.com"];
  const email = session?.user?.email ?? "";
  if (!session || !email || !adminEmails.includes(email)) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen py-10 bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="rounded-3xl shadow-xl bg-white/70 backdrop-blur-lg border-0 p-8 mb-8">
          <div className="flex justify-between items-center gap-4 mb-6">
            <PageHeader>Products</PageHeader>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow hover:from-blue-600 hover:to-purple-600"
            >
              <Link href="/admin/products/new">New Product</Link>
            </Button>
          </div>
          <ProductsTable />
        </div>
      </div>
    </div>
  );
}

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  });

  if (products.length === 0) return <p>No products found</p>;

  return (
    <Table className="rounded-2xl overflow-hidden shadow-lg bg-white/80">
      <TableHeader className="bg-gradient-to-r from-blue-100 to-purple-100">
        <TableRow>
          <TableHead className="w-0 text-center">Status</TableHead>
          <TableHead className="text-lg font-bold text-gray-900">
            Name
          </TableHead>
          <TableHead className="text-lg font-bold text-gray-900">
            Price
          </TableHead>
          <TableHead className="text-lg font-bold text-gray-900">
            Orders
          </TableHead>
          <TableHead className="w-0 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const isValuable = product.isAvailableForPurchase;
          return (
            <TableRow
              key={product.id}
              className={
                isValuable
                  ? "bg-green-50/60 hover:bg-green-100 transition-colors"
                  : "bg-red-50/60 hover:bg-red-100 transition-colors"
              }
            >
              <TableCell className="text-center">
                {isValuable ? (
                  <span className="inline-flex items-center justify-center bg-green-100 text-green-700 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center bg-red-100 text-red-700 p-2 rounded-full">
                    <XCircle className="h-5 w-5" />
                  </span>
                )}
              </TableCell>
              <TableCell className="font-medium text-gray-900">
                {product.name}
              </TableCell>
              <TableCell className="font-semibold text-blue-600">
                {formatCurrency(product.priceInCents / 100)}
              </TableCell>
              <TableCell className="font-semibold text-purple-600">
                {formatNumber(product._count.orders)}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <a
                        download
                        href={`/admin/products/${product.id}/download`}
                      >
                        Download
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <ActiveToggleDropdownItem
                      id={product.id}
                      isAvailableForPurchase={product.isAvailableForPurchase}
                    />
                    <DropdownMenuSeparator />
                    <DeleteDropdownItem
                      id={product.id}
                      disabled={product._count.orders > 0}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
