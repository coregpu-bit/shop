import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const metadata = {
  title: "컬렉션 — MAISON LUMIÈRE",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-14 text-center">
        <p className="eyebrow">The Collection</p>
        <h1 className="mt-3 text-4xl md:text-5xl">전체 컬렉션</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-stone">
          모든 제품은 장인이 직접 제작합니다.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
