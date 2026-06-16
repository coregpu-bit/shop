import Link from "next/link";
import { signIn } from "@/app/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-20">
      <p className="eyebrow text-center">Welcome back</p>
      <h1 className="mt-3 text-center text-4xl">로그인</h1>

      {message && (
        <p className="mt-6 rounded-md bg-cream px-4 py-3 text-center text-sm text-ink">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-6 rounded-md bg-hermes/10 px-4 py-3 text-center text-sm text-hermes-dark">
          {error}
        </p>
      )}

      <form action={signIn} className="mt-8 space-y-5">
        <div>
          <label className="eyebrow mb-2 block">이메일</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border border-line bg-white px-4 py-3 text-sm outline-none focus:border-hermes"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="eyebrow mb-2 block">비밀번호</label>
          <input
            type="password"
            name="password"
            required
            className="w-full border border-line bg-white px-4 py-3 text-sm outline-none focus:border-hermes"
            placeholder="••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-ink py-3.5 text-sm tracking-wide text-white transition-colors hover:bg-hermes"
        >
          로그인
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone">
        아직 회원이 아니신가요?{" "}
        <Link href="/signup" className="text-hermes hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
