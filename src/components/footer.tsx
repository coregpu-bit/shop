import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-xl">MAISON LUMIÈRE</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone">
            장인의 손끝에서 완성되는 시대를 초월한 가죽 공예. 한 점 한 점에
            담긴 품격을 전합니다.
          </p>
        </div>

        <div className="text-sm">
          <p className="eyebrow mb-4">메종</p>
          <ul className="space-y-2 text-stone">
            <li>
              <Link href="/products" className="hover:text-hermes">
                컬렉션
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-hermes">
                내 주문
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="eyebrow mb-4">고객 안내</p>
          <p className="leading-relaxed text-stone">
            본 사이트는 개발 연습용 데모입니다. 결제는 토스페이먼츠 테스트
            환경으로 동작하며 실제 결제가 이루어지지 않습니다.
          </p>
        </div>
      </div>
      <div className="border-t border-line py-6 text-center text-xs text-stone">
        © {new Date().getFullYear()} MAISON LUMIÈRE — Demo project.
      </div>
    </footer>
  );
}
