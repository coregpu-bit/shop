# MAISON LUMIÈRE — 명품 가방 쇼핑몰 (연습 프로젝트)

에르메스에서 영감을 받은 디자인의 명품 가방 인터넷 쇼핑몰입니다.

- **Next.js 16** (App Router, React 19)
- **Supabase** (DB + 이메일 로그인)
- **토스페이먼츠 v2** 결제창 연동
- **Tailwind CSS v4**

## 주요 기능

- 상품 목록 / 상세 페이지
- 회원가입 · 로그인 (Supabase Auth)
- 장바구니 (브라우저 저장)
- 토스페이먼츠 결제 + 서버 결제 승인
- 내 주문 내역

## 로컬에서 실행하기

1. 환경변수 준비: `.env.example` 을 복사해 `.env.local` 을 만들고 값을 채우세요.

   | 변수 | 설명 |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable(anon) 키 |
   | `NEXT_PUBLIC_TOSS_CLIENT_KEY` | 토스 테스트 클라이언트 키 |
   | `TOSS_SECRET_KEY` | 토스 테스트 시크릿 키 (서버 전용) |

2. 패키지 설치 후 개발 서버 실행:

   ```bash
   npm install
   npm run dev
   ```

   http://localhost:3000 접속.

## 결제 테스트

- 결제창에서 토스가 제공하는 **테스트 카드**로 결제하면 실제 청구 없이 흐름을 확인할 수 있습니다.
- 결제하려면 먼저 **로그인**이 필요합니다.

## Vercel 배포

1. 이 폴더를 GitHub 레포지토리에 푸시합니다.
2. [Vercel](https://vercel.com)에서 해당 레포를 Import 합니다.
3. **Environment Variables** 에 위 4개 변수를 등록한 뒤 Deploy 합니다.

> 참고: 이 Next.js 16 은 `middleware` 대신 `proxy.ts` 를 사용하고,
> `params`/`searchParams` 가 Promise 입니다. (일반 Next.js 와 다름)
