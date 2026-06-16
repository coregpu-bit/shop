"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-28 text-center">
        <p className="eyebrow">Your bag</p>
        <h1 className="mt-3 text-4xl">장바구니가 비어 있어요</h1>
        <p className="mt-4 text-sm text-stone">
          메종의 컬렉션에서 마음에 드는 제품을 담아보세요.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block bg-ink px-10 py-4 text-sm tracking-widest text-white transition-colors hover:bg-hermes"
        >
          컬렉션 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl">장바구니</h1>

      <div className="mt-10 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <div key={item.id} className="flex gap-5 py-6">
            <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-cream">
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <Link
                  href={`/products/${item.id}`}
                  className="font-display text-lg hover:text-hermes"
                >
                  {item.name}
                </Link>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-stone transition-colors hover:text-hermes"
                >
                  삭제
                </button>
              </div>

              <div className="flex items-end justify-between">
                <div className="flex items-center border border-line">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    className="px-3 py-1.5 text-stone transition-colors hover:text-hermes"
                    aria-label="수량 줄이기"
                  >
                    –
                  </button>
                  <span className="w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    className="px-3 py-1.5 text-stone transition-colors hover:text-hermes"
                    aria-label="수량 늘리기"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="eyebrow">합계</span>
        <span className="font-display text-3xl">{formatPrice(total)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-8 block bg-ink py-4 text-center text-sm tracking-widest text-white transition-colors hover:bg-hermes"
      >
        결제하기
      </Link>
    </div>
  );
}
