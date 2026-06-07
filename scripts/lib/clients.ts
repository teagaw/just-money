// =============================================================================
// Shared API clients
// =============================================================================
// One module exports configured clients for every service. Each client
// gracefully degrades if its API key is missing (so the CLI can boot and
// tell you exactly which keys are missing).
// =============================================================================

import OpenAI from "openai";
import { Client as NotionClient } from "@notionhq/client";
import { createClient as createSupabase } from "@supabase/supabase-js";
import Stripe from "stripe";
import { google } from "googleapis";

export type ServiceStatus = {
  name: string;
  ready: boolean;
  missing: string[];
  hint: string;
};

const require = (name: string, value: string | undefined): string | null => {
  return value && value !== "" && !value.startsWith("replace-me") ? value : null;
};

const report = (name: string, ready: boolean, missing: string[], hint: string): ServiceStatus => ({
  name,
  ready,
  missing,
  hint,
});

export function status(): ServiceStatus[] {
  return [
    report(
      "openai",
      !!require("OPENAI_API_KEY", process.env.OPENAI_API_KEY),
      ["OPENAI_API_KEY"],
      "https://platform.openai.com/api-keys"
    ),
    report(
      "notion",
      !!require("NOTION_API_KEY", process.env.NOTION_API_KEY),
      ["NOTION_API_KEY"],
      "https://www.notion.so/my-integrations"
    ),
    report(
      "supabase",
      !!require("SUPABASE_URL", process.env.SUPABASE_URL) &&
        !!require("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY),
      ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
      "https://app.supabase.com"
    ),
    report(
      "stripe",
      !!require("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY),
      ["STRIPE_SECRET_KEY"],
      "https://dashboard.stripe.com/apikeys"
    ),
    report(
      "etsy",
      !!require("ETSY_ACCESS_TOKEN", process.env.ETSY_ACCESS_TOKEN),
      ["ETSY_ACCESS_TOKEN", "ETSY_SHOP_ID"],
      "https://developer.etsy.com — apply for API access (1-3 days)"
    ),
    report(
      "gumroad",
      !!require("GUMROAD_PERSONAL_ACCESS_TOKEN", process.env.GUMROAD_PERSONAL_ACCESS_TOKEN),
      ["GUMROAD_PERSONAL_ACCESS_TOKEN"],
      "https://gumroad.com/settings/developer"
    ),
    report(
      "google",
      !!require("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID),
      ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
      "https://console.cloud.google.com → enable Sheets API"
    ),
    report(
      "vercel",
      !!require("VERCEL_TOKEN", process.env.VERCEL_TOKEN),
      ["VERCEL_TOKEN"],
      "https://vercel.com/account/tokens"
    ),
    report(
      "pinterest",
      !!require("PINTEREST_ACCESS_TOKEN", process.env.PINTEREST_ACCESS_TOKEN),
      ["PINTEREST_ACCESS_TOKEN"],
      "https://developers.pinterest.com/apps/"
    ),
    report(
      "x",
      !!require("X_API_KEY", process.env.X_API_KEY),
      ["X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_SECRET"],
      "https://developer.twitter.com/en/portal"
    ),
  ];
}

export function readyOnly(): string[] {
  return status().filter((s) => s.ready).map((s) => s.name);
}

export function missingOnly(): ServiceStatus[] {
  return status().filter((s) => !s.ready);
}

// Lazy clients — only init when first used
let _openai: OpenAI | null = null;
export function openai(): OpenAI {
  if (!_openai) {
    const key = require("OPENAI_API_KEY", process.env.OPENAI_API_KEY);
    if (!key) throw new Error("OPENAI_API_KEY missing — set in .env");
    _openai = new OpenAI({ apiKey: key });
  }
  return _openai;
}

let _notion: NotionClient | null = null;
export function notion(): NotionClient {
  if (!_notion) {
    const key = require("NOTION_API_KEY", process.env.NOTION_API_KEY);
    if (!key) throw new Error("NOTION_API_KEY missing — set in .env");
    _notion = new NotionClient({ auth: key });
  }
  return _notion;
}

let _supabase: ReturnType<typeof createSupabase> | null = null;
export function supabase() {
  if (!_supabase) {
    const url = require("SUPABASE_URL", process.env.SUPABASE_URL);
    const key = require("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
    if (!url || !key) throw new Error("Supabase env vars missing — set in .env");
    _supabase = createSupabase(url, key);
  }
  return _supabase;
}

let _stripe: Stripe | null = null;
export function stripe(): Stripe {
  if (!_stripe) {
    const key = require("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY);
    if (!key) throw new Error("STRIPE_SECRET_KEY missing — set in .env");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export function googleAuth() {
  const id = require("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
  const secret = require("GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET);
  const redirect = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/google/callback";
  if (!id || !secret) throw new Error("Google OAuth env vars missing");
  return new google.auth.OAuth2(id, secret, redirect);
}
