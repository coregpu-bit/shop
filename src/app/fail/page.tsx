import Link from "next/link";

export default async function FailPage({
  searchParams,
}: {
  // Next.js 16: searchParams 는 Promise -> 반드시 await
  searchParams: Promise<{ code?: string; message?: string }>;
}) {
  const { code, message } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-6 py-28 text-center">
      <p className="eyebrow text-hermes">Payment failed</p>
      <h1 className="mt-3 text-4xl">결제에 실패했어요</h1>
      <p className="mt-6 text-stone">
        {message ?? "결제가 취소되었거나 오류가 발생했습니다."}
      </p>
      {code && <p className="mt-1 text-xs text-stone">오류 코드: {code}</p>}

      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/cart"
          className="border border-ink px-8 py-3.5 text-sm tracking-wide transition-colors hover:border-hermes hover:text-hermes"
        >
          장바구니로
        </Link>
        <Link
          href="/checkout"
          className="bg-ink px-8 py-3.5 text-sm tracking-wide text-white transition-colors hover:bg-hermes"
        >
          다시 결제하기
        </Link>
      </div>
    </div>
  );
}
