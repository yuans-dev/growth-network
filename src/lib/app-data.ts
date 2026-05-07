import type { SupabaseClient } from "@supabase/supabase-js";

export type MatchRecord = {
  id: string;
  member_a_id: string;
  member_b_id: string;
  fit_score: number | null;
  summary: string | null;
  status: "pending" | "accepted" | "declined" | "introduced";
  member_a_status: "pending" | "accepted" | "declined";
  member_b_status: "pending" | "accepted" | "declined";
  created_at: string;
};

export type AdvisorCompanyRecord = {
  id: string;
  business_name: string | null;
  full_name: string | null;
  sector: string | null;
  stage: string | null;
  verification_status: string | null;
};

export type AdvisorMatchRecord = MatchRecord;

export async function fetchAdvisorDashboardData(supabase: SupabaseClient) {
  const [profilesResponse, matchesResponse] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, business_name, full_name, sector, stage, verification_status",
      )
      .order("full_name", { ascending: true }),
    supabase
      .from("matches")
      .select(
        "id, member_a_id, member_b_id, fit_score, summary, status, member_a_status, member_b_status, created_at",
      )
      .in("status", ["pending", "accepted", "declined", "introduced"])
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  return {
    companies: (profilesResponse.data ?? []) as AdvisorCompanyRecord[],
    matches: (matchesResponse.data ?? []) as AdvisorMatchRecord[],
  };
}

export async function fetchDashboardSummary(
  supabase: SupabaseClient,
  userId: string,
) {
  const [
    { count: pendingMatches },
    { count: activeDeals },
    { data: creditRows },
    { data: profile },
  ] = await Promise.all([
    supabase
      .from("matches")
      .select("id", { count: "exact", head: true })
      .or(`member_a_id.eq.${userId},member_b_id.eq.${userId}`)
      .eq("status", "pending"),
    supabase
      .from("deal_cards")
      .select("id", { count: "exact", head: true })
      .or(`buyer_member_id.eq.${userId},provider_member_id.eq.${userId}`)
      .not("stage", "in", '("Closed-Won","Closed-Lost / On Hold")'),
    supabase
      .from("ad_credit_ledger")
      .select("change_amount")
      .eq("member_id", userId),
    supabase
      .from("profiles")
      .select("full_name, stage, verification_status")
      .eq("id", userId)
      .single(),
  ]);

  const adCredits = (creditRows ?? []).reduce(
    (sum, row) => sum + Number(row.change_amount ?? 0),
    0,
  );

  return {
    pendingMatches: pendingMatches ?? 0,
    activeDeals: activeDeals ?? 0,
    adCredits,
    profile: profile ?? null,
  };
}

export async function fetchUserMatches(
  supabase: SupabaseClient,
  userId: string,
): Promise<Array<MatchRecord & { counterpart_name: string | null }>> {
  const { data: matches, error } = await supabase
    .from("matches")
    .select(
      "id, member_a_id, member_b_id, fit_score, summary, status, member_a_status, member_b_status, created_at",
    )
    .or(`member_a_id.eq.${userId},member_b_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error || !matches) {
    return [];
  }

  const counterpartIds = Array.from(
    new Set(
      matches.map((row) =>
        row.member_a_id === userId ? row.member_b_id : row.member_a_id,
      ),
    ),
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, business_name, full_name")
    .in("id", counterpartIds);

  const counterpartById = new Map(
    (profiles ?? []).map((p) => [
      p.id,
      p.business_name || p.full_name || "Verified member",
    ]),
  );

  return matches.map((row) => {
    const counterpartId =
      row.member_a_id === userId ? row.member_b_id : row.member_a_id;

    return {
      ...row,
      counterpart_name: counterpartById.get(counterpartId) ?? null,
    };
  });
}

export async function respondToMatch(
  supabase: SupabaseClient,
  userId: string,
  match: MatchRecord,
  decision: "accepted" | "declined",
) {
  const isMemberA = match.member_a_id === userId;
  const nextMemberAStatus = isMemberA ? decision : match.member_a_status;
  const nextMemberBStatus = isMemberA ? match.member_b_status : decision;

  let nextStatus: MatchRecord["status"] = "pending";
  if (nextMemberAStatus === "declined" || nextMemberBStatus === "declined") {
    nextStatus = "declined";
  } else if (
    nextMemberAStatus === "accepted" &&
    nextMemberBStatus === "accepted"
  ) {
    nextStatus = "accepted";
  }

  const { error } = await supabase
    .from("matches")
    .update({
      member_a_status: nextMemberAStatus,
      member_b_status: nextMemberBStatus,
      status: nextStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", match.id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function fetchDealCards(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("deal_cards")
    .select(
      "id, title, stage, fit_score, confidence, impact_projection, next_action, next_action_due, blocker, close_reason_code, last_updated_at",
    )
    .or(`buyer_member_id.eq.${userId},provider_member_id.eq.${userId}`)
    .order("last_updated_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function touchDealCard(supabase: SupabaseClient, dealId: string) {
  const { error } = await supabase
    .from("deal_cards")
    .update({ last_updated_at: new Date().toISOString() })
    .eq("id", dealId);

  return { error: error?.message ?? null };
}

export async function fetchDocuments(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("member_documents")
    .select(
      "id, document_type, status, file_path, uploaded_at, reviewed_at, reviewed_by, reject_reason",
    )
    .eq("member_id", userId)
    .order("uploaded_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function createPlaceholderDocument(
  supabase: SupabaseClient,
  userId: string,
  documentType: string,
) {
  const { error } = await supabase.from("member_documents").insert({
    member_id: userId,
    document_type: documentType,
    status: "submitted",
    file_path: `pending://${documentType}/${Date.now()}`,
  });

  return { error: error?.message ?? null };
}

export async function fetchEvents(supabase: SupabaseClient, userId: string) {
  const nowIso = new Date().toISOString();

  const [{ data: upcoming }, { data: past }, { data: registrations }] =
    await Promise.all([
      supabase
        .from("events")
        .select(
          "id, title, type, starts_at, ends_at, location, max_attendees, description",
        )
        .gte("starts_at", nowIso)
        .order("starts_at", { ascending: true })
        .limit(20),
      supabase
        .from("events")
        .select("id, title, type, starts_at")
        .lt("starts_at", nowIso)
        .order("starts_at", { ascending: false })
        .limit(10),
      supabase
        .from("event_registrations")
        .select("event_id, attended")
        .eq("member_id", userId),
    ]);

  const registrationMap = new Map(
    (registrations ?? []).map((row) => [row.event_id, row]),
  );

  return {
    upcoming: (upcoming ?? []).map((event) => ({
      ...event,
      registered: registrationMap.has(event.id),
      attended: registrationMap.get(event.id)?.attended ?? false,
    })),
    past: past ?? [],
  };
}

export async function registerForEvent(
  supabase: SupabaseClient,
  userId: string,
  eventId: string,
) {
  const { error } = await supabase.from("event_registrations").upsert(
    {
      member_id: userId,
      event_id: eventId,
      registered_at: new Date().toISOString(),
      attended: false,
    },
    { onConflict: "event_id,member_id", ignoreDuplicates: false },
  );

  return { error: error?.message ?? null };
}

export async function markEventAttendance(
  supabase: SupabaseClient,
  userId: string,
  eventId: string,
) {
  const { error } = await supabase
    .from("event_registrations")
    .update({ attended: true, pitch_credit: 1 })
    .eq("event_id", eventId)
    .eq("member_id", userId);

  return { error: error?.message ?? null };
}

export async function fetchProfileAndSignals(
  supabase: SupabaseClient,
  userId: string,
) {
  const [{ data: profile }, { data: signals }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, full_name, business_name, role_title, city, short_bio, sector, employee_band, annual_revenue_estimate, stage, verification_status",
      )
      .eq("id", userId)
      .single(),
    supabase
      .from("member_asks_offers")
      .select("id, kind, title, description, status")
      .eq("member_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  return {
    profile: profile ?? null,
    asks: (signals ?? []).filter((s) => s.kind === "ask"),
    offers: (signals ?? []).filter((s) => s.kind === "offer"),
  };
}

export async function createAskOffer(
  supabase: SupabaseClient,
  userId: string,
  kind: "ask" | "offer",
  payload: { title: string; description: string; status: string },
) {
  const { error } = await supabase.from("member_asks_offers").insert({
    member_id: userId,
    kind,
    title: payload.title,
    description: payload.description,
    status: payload.status,
  });

  return { error: error?.message ?? null };
}

export async function deleteAskOffer(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from("member_asks_offers")
    .delete()
    .eq("id", id);
  return { error: error?.message ?? null };
}
