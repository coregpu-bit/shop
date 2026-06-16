"use client";

import { useState } from "react";
import Link from "next/link";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/format";
import { createPendingOrder } from "./actions";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setError(null);
    setLoading(true);
    try {
      // 1) 서버에 주문(PENDING) 저장 + 금액 재계산
      const result = await createPendingOrder(
        items.map((i) => ({ id: i.id, quantity: i.quantity })),
      );

      if ("error" in result) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // 2) 토스 결제창 호출
      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({
        customerKey: result.customerKey ?? ANONYMOUS,
      });

      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: result.amount },
        orderId: result.orderId,
        orderName: result.orderName,
        successUrl: window.location.origin + "/success",
        failUrl: window.location.origin + "/fail",
        card: {
          useEscrow: false,
          flowMode: "DEFAULT",
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
      // requestPayment 가 성공하면 successUrl 로 리다이렉트됨
    } catch {
      setError(
        "결제 요청 중 문제가 발생했어요. 로그인 상태를 확인하고 다시 시도해 주세요.",
      );
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-28 text-center">
        <h1 className="text-3xl">결제할 상품이 없어요</h1>
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
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="eyebrow">Checkout</p>
      <h1 className="mt-3 text-4xl">주문 / 결제</h1>

      {/* 주문 요약 */}
      <div className="mt-10 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between py-4 text-sm">
            <span>
              {item.name}{" "}
              <span className="text-stone">× {item.quantity}</span>
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="eyebrow">결제 금액</span>
        <span className="font-display text-3xl">{formatPrice(total)}</span>
      </div>

      {error && (
        <p className="mt-6 rounded-md bg-hermes/10 px-4 py-3 text-sm text-hermes-dark">
          {error}
          {error.includes("로그인") && (
            <>
              {" "}
              <Link href="/login" className="underline">
                로그인하러 가기
              </Link>
            </>
          )}
        </p>
      )}

      <button
        onClick={handlePay}
        disabled={loading}
        className="mt-8 block w-full bg-ink py-4 text-center text-sm tracking-widest text-white transition-colors hover:bg-hermes disabled:opacity-50"
      >
        {loading ? "결제창을 여는 중…" : `${formatPrice(total)} 결제하기`}
      </button>

      <p className="mt-4 text-center text-xs text-stone">
        토스페이먼츠 테스트 환경입니다. 실제 결제가 이루어지지 않아요.
      </p>
    </div>
  );
}
