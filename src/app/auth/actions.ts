"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// 폼 제출 시 에러를 쿼리스트링으로 돌려주기 위한 헬퍼
function withError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    withError("/login", "이메일 또는 비밀번호가 올바르지 않아요.");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) {
    withError("/signup", "비밀번호는 6자 이상이어야 해요.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    withError("/signup", error.message);
  }

  // 이메일 인증이 켜져 있으면 session 이 없다 -> 로그인 페이지에서 안내
  if (!data.session) {
    redirect(
      `/login?message=${encodeURIComponent("가입 완료! 메일함에서 인증 후 로그인해 주세요. (또는 바로 로그인 시도)")}`,
    );
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
