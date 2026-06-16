import Link from "next/link";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 3);

  return (
    <div>
      {/* 히어로 */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-28 text-center md:py-40">
          <p className="eyebrow">Depuis 1952 · Paris</p>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl leading-tight md:text-7xl">
            시간을 견디는 <span className="text-hermes">아름다움</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-stone">
            장인의 손끝에서 한 점씩 완성되는 가죽 공예. 메종 뤼미에르가
            전하는 절제된 품격을 만나보세요.
          </p>
          <Link
            href="/products"
            className="mt-10 inline-block bg-ink px-10 py-4 text-sm tracking-widest text-white transition-colors hover:bg-hermes"
          >
            컬렉션 둘러보기
          </Link>
        </div>
      </section>

      {/* 추천 상품 */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="eyebrow">Signature</p>
            <h2 className="mt-2 text-3xl">대표 컬렉션</h2>
          </div>
          <Link
            href="/products"
            className="text-sm text-stone transition-colors hover:text-hermes"
          >
            전체 보기 →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
