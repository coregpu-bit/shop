"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-context";

type Props = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  stock: number;
};

export function AddToCartButton({ id, name, price, image_url, stock }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const soldOut = stock <= 0;

  function handleAdd() {
    addItem({ id, name, price, image_url }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addItem({ id, name, price, image_url }, quantity);
    router.push("/checkout");
  }

  if (soldOut) {
    return (
      <button
        disabled
        className="mt-8 w-full cursor-not-allowed border border-line py-4 text-sm tracking-wide text-stone"
      >
        품절
      </button>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {/* 수량 선택 */}
      <div className="flex items-center gap-4">
        <span className="eyebrow">수량</span>
        <div className="flex items-center border border-line">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-2 text-lg text-stone transition-colors hover:text-hermes"
            aria-label="수량 줄이기"
          >
            –
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            className="px-4 py-2 text-lg text-stone transition-colors hover:text-hermes"
            aria-label="수량 늘리기"
          >
            +
          </button>
        </div>
        <span className="text-xs text-stone">재고 {stock}개</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 border border-ink py-4 text-sm tracking-wide transition-colors hover:border-hermes hover:text-hermes"
        >
          {added ? "장바구니에 담았어요 ✓" : "장바구니 담기"}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 bg-ink py-4 text-sm tracking-wide text-white transition-colors hover:bg-hermes"
        >
          바로 구매
        </button>
      </div>
    </div>
  );
}
