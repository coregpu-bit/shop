import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 상품 플레이스홀더 이미지 호스트 허용 (next/image 사용 시 필요)
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
