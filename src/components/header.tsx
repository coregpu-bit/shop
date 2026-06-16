"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { signOut } from "@/app/auth/actions";

export function Header({ userEmail }: { userEmail: string | null }) {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* 로고 */}
        <Link href="/" className="font-display text-2xl tracking-wide">
          MAISON LUMIÈRE
        </Link>

        {/* 가운데 네비게이션 */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/products" className="transition-colors hover:text-hermes">
            컬렉션
          </Link>
          <Link href="/orders" className="transition-colors hover:text-hermes">
            내 주문
          </Link>
        </nav>

        {/* 우측: 계정 + 장바구니 */}
        <div className="flex items-center gap-5 text-sm">
          {userEmail ? (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="max-w-[140px] truncate text-stone">{userEmail}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-stone transition-colors hover:text-hermes"
                >
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-stone transition-colors hover:text-hermes"
            >
              로그인
            </Link>
          )}

          <Link href="/cart" className="relative transition-colors hover:text-hermes">
            장바구니
            {count > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-hermes px-1.5 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
