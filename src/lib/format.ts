// 원화 가격 포맷터: 12800000 -> "₩12,800,000"
export function formatPrice(value: number): string {
  return "₩" + value.toLocaleString("ko-KR");
}
