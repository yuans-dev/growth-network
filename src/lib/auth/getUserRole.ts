import { createClient } from "@/lib/supabase/server";
import { getRoleFromAccessToken } from "@/lib/auth/jwt";

export async function getUserRole() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return getRoleFromAccessToken(session?.access_token);
}
