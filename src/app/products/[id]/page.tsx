import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/add-to-cart-button";

export default async function ProductDetailPage({
  params,
}: {
  // Next.js 16: params 는 Promise -> 반드시 await
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/products"
        className="text-sm text-stone transition-colors hover:text-hermes"
      >
        ← 컬렉션으로
      </Link>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        {/* 이미지 */}
        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {/* 정보 */}
        <div className="flex flex-col justify-center">
          <p className="eyebrow">MAISON LUMIÈRE</p>
          <h1 className="mt-3 text-4xl leading-tight">{product.name}</h1>
          <p className="mt-5 text-2xl text-hermes">{formatPrice(product.price)}</p>
          <p className="mt-6 leading-relaxed text-stone">{product.description}</p>

          <AddToCartButton
            id={product.id}
            name={product.name}
            price={product.price}
            image_url={product.image_url}
            stock={product.stock}
          />

          <p className="mt-8 border-t border-line pt-6 text-xs leading-relaxed text-stone">
            · 전 제품 정품 보증 · 무료 배송 및 반품 · 평생 애프터케어 서비스
          </p>
        </div>
      </div>
    </div>
  );
}
