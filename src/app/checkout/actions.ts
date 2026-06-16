"use server";

import { createClient } from "@/lib/supabase/server";

export type CheckoutItem = { id: string; quantity: number };

type CreateOrderResult =
  | { error: string }
  | { orderId: string; amount: number; orderName: string; customerKey: string };

// 결제 요청 전, 서버에서 금액을 다시 계산해 주문을 PENDING 으로 저장한다.
// (클라이언트가 보낸 가격을 믿지 않고 DB 가격으로 계산 -> 위변조 방지)
export async function createPendingOrder(
  items: CheckoutItem[],
): Promise<CreateOrderResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };
  if (!items.length) return { error: "장바구니가 비어 있습니다." };

  const ids = items.map((i) => i.id);
  const { data: products } = await supabase
    .from("products")
    .select("id,name,price")
    .in("id", ids);

  if (!products || products.length === 0) {
    return { error: "상품 정보를 찾을 수 없습니다." };
  }

  let amount = 0;
  const orderItemsData: {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
  }[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.id);
    if (!product) continue;
    const quantity = Math.max(1, item.quantity);
    amount += product.price * quantity;
    orderItemsData.push({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
  }

  if (amount <= 0) return { error: "결제 금액이 올바르지 않습니다." };

  const firstName = orderItemsData[0]?.name ?? "주문";
  const orderName =
    orderItemsData.length > 1
      ? `${firstName} 외 ${orderItemsData.length - 1}건`
      : firstName;
  const orderId = `order_${crypto.randomUUID()}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_id: orderId,
      user_id: user.id,
      amount,
      order_name: orderName,
      status: "PENDING",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: "주문 생성에 실패했습니다. 다시 시도해 주세요." };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    orderItemsData.map((oi) => ({ ...oi, order_id: order.id })),
  );

  if (itemsError) {
    return { error: "주문 항목 저장에 실패했습니다." };
  }

  return { orderId, amount, orderName, customerKey: user.id };
}
