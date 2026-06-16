"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart-context";

// 결제 성공 화면에서 마운트되면 장바구니를 비운다.
export function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
    // 최초 1회만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
