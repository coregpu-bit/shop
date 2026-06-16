import Link from "next/link";
import { signUp } from "@/app/auth/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-20">
      <p className="eyebrow text-center">Join the maison</p>
      <h1 className="mt-3 text-center text-4xl">회원가입</h1>

      {error && (
        <p className="mt-6 rounded-md bg-hermes/10 px-4 py-3 text-center text-sm text-hermes-dark">
          {error}
        </p>
      )}

      <form action={signUp} className="mt-8 space-y-5">
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
          <label className="eyebrow mb-2 block">비밀번호 (6자 이상)</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="w-full border border-line bg-white px-4 py-3 text-sm outline-none focus:border-hermes"
            placeholder="••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-ink py-3.5 text-sm tracking-wide text-white transition-colors hover:bg-hermes"
        >
          가입하기
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone">
        이미 회원이신가요?{" "}
        <Link href="/login" className="text-hermes hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
