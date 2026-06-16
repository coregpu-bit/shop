import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { confirmTossPayment } from "@/lib/toss";
import { formatPrice } from "@/lib/format";
import { ClearCart } from "@/components/clear-cart";

type SearchParams = {
  paymentKey?: string;
  orderId?: string;
  amount?: string;
};

function ErrorView({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-28 text-center">
      <p className="eyebrow text-hermes">결제 확인 실패</p>
      <h1 className="mt-3 text-4xl">{message}</h1>
      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/cart"
          className="border border-ink px-8 py-3.5 text-sm tracking-wide transition-colors hover:border-hermes hover:text-hermes"
        >
          장바구니로
        </Link>
        <Link
          href="/products"
          className="bg-ink px-8 py-3.5 text-sm tracking-wide text-white transition-colors hover:bg-hermes"
        >
          컬렉션으로
        </Link>
      </div>
    </div>
  );
}

export default async function SuccessPage({
  searchParams,
}: {
  // Next.js 16: searchParams 는 Promise -> 반드시 await
  searchParams: Promise<SearchParams>;
}) {
  const { paymentKey, orderId, amount } = await searchParams;

  if (!paymentKey || !orderId || !amount) {
    return <ErrorView message="결제 정보가 올바르지 않아요." />;
  }

  const amountNumber = Number(amount);
  const supabase = await createClient();

  // 내 주문 조회 (RLS 로 본인 주문만 조회됨)
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();

  if (!order) {
    return <ErrorView message="주문을 찾을 수 없어요." />;
  }

  // 이미 결제 완료된 주문이면 재승인하지 않고 성공 화면 표시 (새로고침 대비)
  if (order.status === "PAID") {
    return <SuccessView orderName={order.order_name} amount={order.amount} />;
  }

  // 저장된 금액과 요청 금액이 다르면 위변조 의심 -> 승인 중단
  if (order.amount !== amountNumber) {
    await supabase
      .from("orders")
      .update({ status: "FAILED" })
      .eq("id", order.id);
    return <ErrorView message="결제 금액이 일치하지 않아요." />;
  }

  // 토스 결제 승인
  const { ok, data } = await confirmTossPayment({
    paymentKey,
    orderId,
    amount: amountNumber,
  });

  if (!ok) {
    await supabase
      .from("orders")
      .update({ status: "FAILED" })
      .eq("id", order.id);
    const message =
      (typeof data.message === "string" && data.message) ||
      "결제 승인에 실패했어요.";
    return <ErrorView message={message} />;
  }

  // 승인 성공 -> PAID 로 업데이트
  await supabase
    .from("orders")
    .update({ status: "PAID", payment_key: paymentKey })
    .eq("id", order.id);

  return <SuccessView orderName={order.order_name} amount={order.amount} />;
}

function SuccessView({
  orderName,
  amount,
}: {
  orderName: string;
  amount: number;
}) {
  return (
    <div className="mx-auto max-w-xl px-6 py-28 text-center">
      {/* 결제 성공 시 장바구니 비우기 */}
      <ClearCart />
      <p className="eyebrow text-hermes">Order confirmed</p>
      <h1 className="mt-3 text-4xl">결제가 완료되었어요</h1>
      <p className="mt-6 text-stone">{orderName}</p>
      <p className="mt-2 font-display text-3xl">{formatPrice(amount)}</p>
      <p className="mt-6 text-sm leading-relaxed text-stone">
        주문해 주셔서 감사합니다. 장인이 정성껏 준비하여 보내드리겠습니다.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/orders"
          className="border border-ink px-8 py-3.5 text-sm tracking-wide transition-colors hover:border-hermes hover:text-hermes"
        >
          내 주문 보기
        </Link>
        <Link
          href="/products"
          className="bg-ink px-8 py-3.5 text-sm tracking-wide text-white transition-colors hover:bg-hermes"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}
