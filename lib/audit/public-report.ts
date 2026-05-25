import { getSupabaseAdmin } from "@/lib/db/supabase";
import type { AuditResult } from "@/lib/audit/types";

export async function getPublicAuditResult(slug: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("audits")
    .select("result, summary, public_slug")
    .eq("public_slug", slug)
    .single();

  if (error || !data?.result) {
    return null;
  }

  const result = data.result as AuditResult;

  return {
    ...result,
    summary: data.summary || result.summary,
    publicSlug: data.public_slug || result.publicSlug
  };
}
