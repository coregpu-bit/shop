// 토스페이먼츠 결제 승인(confirm) — 서버에서만 호출 (TOSS_SECRET_KEY 사용)
const CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

type ConfirmParams = {
  paymentKey: string;
  orderId: string;
  amount: number;
};

export async function confirmTossPayment({
  paymentKey,
  orderId,
  amount,
}: ConfirmParams): Promise<{ ok: boolean; data: Record<string, unknown> }> {
  const secretKey = process.env.TOSS_SECRET_KEY!;
  // 시크릿 키 뒤에 ":" 를 붙여 base64 인코딩 -> Basic 인증
  const encoded = Buffer.from(`${secretKey}:`).toString("base64");

  const res = await fetch(CONFIRM_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const data = (await res.json()) as Record<string, unknown>;
  return { ok: res.ok, data };
}
