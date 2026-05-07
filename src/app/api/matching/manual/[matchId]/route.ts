import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRoleFromAccessToken } from "@/lib/auth/jwt";

async function assertAdvisorAccess() {
  const supabase = await createClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token ?? null;
  const role = getRoleFromAccessToken(accessToken);

  if (!role || !["advisor", "staff", "admin"].includes(role)) {
    return {
      supabase: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { supabase, error: null };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> },
) {
  try {
    const { supabase, error } = await assertAdvisorAccess();
    if (error || !supabase) return error;

    const { matchId } = await params;
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (Object.prototype.hasOwnProperty.call(body, "summary")) {
      updates.summary = body.summary ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(body, "fit_score")) {
      updates.fit_score = body.fit_score ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(body, "status")) {
      updates.status = body.status ?? "pending";
    }
    if (Object.prototype.hasOwnProperty.call(body, "member_a_status")) {
      updates.member_a_status = body.member_a_status ?? "pending";
    }
    if (Object.prototype.hasOwnProperty.call(body, "member_b_status")) {
      updates.member_b_status = body.member_b_status ?? "pending";
    }
    updates.updated_at = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("matches")
      .update(updates)
      .eq("id", matchId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ matchId: string }> },
) {
  try {
    const { supabase, error } = await assertAdvisorAccess();
    if (error || !supabase) return error;

    const { matchId } = await params;
    const { error: deleteError } = await supabase
      .from("matches")
      .delete()
      .eq("id", matchId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown" },
      { status: 500 },
    );
  }
}
