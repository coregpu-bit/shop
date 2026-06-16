"use client";

import { useState } from "react";
import Link from "next/link";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/format";
import { createPendingOrder, type ShippingInfo } from "./actions";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

const EMPTY_SHIPPING: ShippingInfo = {
  name: "",
  phone: "",
  postcode: "",
  address: "",
  addressDetail: "",
  memo: "",
};

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof ShippingInfo, value: string) {
    setShipping((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePay() {
    setError(null);

    // 배송지 필수값 확인 (결제창 열기 전에 안내)
    if (!shipping.name.trim()) return setError("받는 분 성함을 입력해 주세요.");
    if (!shipping.phone.trim()) return setError("연락처를 입력해 주세요.");
    if (!shipping.address.trim()) return setError("주소를 입력해 주세요.");

    setLoading(true);
    try {
      // 1) 서버에 주문(PENDING) 저장 + 금액 재계산 + 배송지 저장
      const result = await createPendingOrder(
        items.map((i) => ({ id: i.id, quantity: i.quantity })),
        shipping,
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
        customerName: result.customerName,
        customerMobilePhone: result.customerPhone || undefined,
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

  const inputClass =
    "w-full border border-line bg-white px-4 py-3 text-sm outline-none focus:border-hermes";

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="eyebrow">Checkout</p>
      <h1 className="mt-3 text-4xl">주문 / 결제</h1>

      {/* 배송지 입력 */}
      <section className="mt-10">
        <h2 className="text-xl">배송지</h2>
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="eyebrow mb-2 block">받는 분 *</label>
              <input
                className={inputClass}
                value={shipping.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="eyebrow mb-2 block">연락처 *</label>
              <input
                className={inputClass}
                value={shipping.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="010-1234-5678"
                inputMode="tel"
              />
            </div>
          </div>

          <div>
            <label className="eyebrow mb-2 block">우편번호</label>
            <input
              className={inputClass}
              value={shipping.postcode}
              onChange={(e) => update("postcode", e.target.value)}
              placeholder="06234"
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="eyebrow mb-2 block">주소 *</label>
            <input
              className={inputClass}
              value={shipping.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="서울특별시 강남구 테헤란로 123"
            />
          </div>

          <div>
            <label className="eyebrow mb-2 block">상세주소</label>
            <input
              className={inputClass}
              value={shipping.addressDetail}
              onChange={(e) => update("addressDetail", e.target.value)}
              placeholder="101동 1001호"
            />
          </div>

          <div>
            <label className="eyebrow mb-2 block">배송 요청사항</label>
            <input
              className={inputClass}
              value={shipping.memo}
              onChange={(e) => update("memo", e.target.value)}
              placeholder="부재 시 경비실에 맡겨주세요"
            />
          </div>
        </div>
      </section>

      {/* 주문 요약 */}
      <section className="mt-12">
        <h2 className="text-xl">주문 상품</h2>
        <div className="mt-5 divide-y divide-line border-y border-line">
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
      </section>

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
