import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category, Product } from "@/lib/types";
import { Package } from "lucide-react";
import { ProductForm } from "@/components/dashboard/product-form";
import Image from "next/image";
import { DeleteButtonProduct } from "@/components/dashboard/delete-button";

export default async function Products() {
  const token = await getToken();

  const categories = await apiClient<Category[]>("/category", {
    token: token!,
  });

  const products = await apiClient<Product[]>("/products", {
    token: token!,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(price / 100);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Products
          </h1>
          <p className="text-sm sm:text-base mt-1">Manage products</p>
        </div>

        <ProductForm categories={categories} />
      </div>

      {products.length !== 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-app-card border-app-border transition-shadow hover:shadow-md text-white overflow-hidden"
            >
              <div className="relative w-full h-48">
                <Image
                  src={product.banner}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardHeader>
                <CardTitle className="gap-2 flex items-center justify-between text-base md:text-lg">
                  <div className="flex flex-row gap-2 items-center">
                    <Package className="w-5 h-5" />
                    <span>{product.name}</span>
                  </div>
                  <DeleteButtonProduct productId={product.id} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-300 text-sm line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-app-border">
                  <span className="text-brand-primary font-bold text-lg">
                    {formatPrice(product.price)}
                  </span>
                  {product.category && (
                    <span className="text-xs bg-app-background px-2 py-1 rounded">
                      {product.category.name}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400 text-lg">There are no products saved</p>
          <p className="text-gray-500 text-sm mt-2">
            Start adding the first product
          </p>
        </div>
      )}
    </div>
  );
}
