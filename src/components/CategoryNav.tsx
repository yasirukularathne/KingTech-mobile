import Link from "next/link";

const categories = [
  { name: "All Products", href: "/products" },
  { name: "TVs", href: "/products?category=TVs" },
  { name: "Phones", href: "/products?category=Phones" },
  { name: "Laptops", href: "/products?category=Laptops" },
  { name: "Gaming", href: "/products?category=Gaming" },
  { name: "Audio", href: "/products?category=Audio" },
  { name: "Accessories", href: "/products?category=Accessories" },
  { name: "Electronics", href: "/products?category=Electronics" },
];

export function CategoryNav() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto py-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="text-gray-600 hover:text-gray-900 whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
