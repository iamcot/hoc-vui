"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/** null khi chưa cấu hình Supabase: app chạy chế độ khách. */
export function getSupabase(): SupabaseClient | null {
  if (!url || !key) return null;
  if (!client) client = createBrowserClient(url, key);
  return client;
}

export const hasSupabase = () => Boolean(url && key);
