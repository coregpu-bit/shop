import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

export const metadata = {
  title: "내 주문 — MAISON LUMIÈRE",
};

const STATUS_LABEL: Record<string, string> = {
  PAID: "결제완료",
  PENDING: "결제대기",
  FAILED: "결제실패",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  const visibleOrders = (orders ?? []).filter((o) => o.status !== "PENDING");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="eyebrow">Order history</p>
      <h1 className="mt-3 text-4xl">내 주문</h1>

      {visibleOrders.length === 0 ? (
        <div className="mt-12 border-y border-line py-16 text-center">
          <p className="text-stone">아직 주문 내역이 없어요.</p>
          <Link
            href="/products"
            className="mt-6 inline-block bg-ink px-8 py-3.5 text-sm tracking-wide text-white transition-colors hover:bg-hermes"
          >
            컬렉션 둘러보기
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {visibleOrders.map((order) => (
            <div key={order.id} className="border border-line p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-lg">{order.order_name}</p>
                  <p className="mt-1 text-xs text-stone">
                    {new Date(order.created_at).toLocaleString("ko-KR")}
                  </p>
                </div>
                <span
                  className={`text-xs ${
                    order.status === "PAID" ? "text-hermes" : "text-stone"
                  }`}
                >
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>

              <div className="mt-4 divide-y divide-line border-t border-line">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 text-sm"
                  >
                    <span>
                      {item.name}{" "}
                      <span className="text-stone">× {item.quantity}</span>
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between">
                <span className="eyebrow">합계</span>
                <span className="font-display text-xl">
                  {formatPrice(order.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
