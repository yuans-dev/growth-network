import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const raw = fs.readFileSync(envPath, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) return;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

loadEnvFile();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing env vars. Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const email = process.argv[2] || "invited.member@growthnetwork.local";
const password = process.argv[3] || "Invite123!";

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  const createResult = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      account_status: "invited",
      full_name: null,
    },
  });

  let user = createResult.data.user;

  if (createResult.error) {
    if (!createResult.error.message.toLowerCase().includes("already")) {
      throw createResult.error;
    }

    const users = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (users.error) throw users.error;
    user =
      users.data.users.find(
        (item) => item.email?.toLowerCase() === email.toLowerCase(),
      ) || null;

    if (!user) {
      throw new Error("User already exists but could not be fetched.");
    }

    await admin.auth.admin.updateUserById(user.id, {
      password,
      user_metadata: {
        ...(user.user_metadata || {}),
        account_status: "invited",
      },
    });
  }

  if (!user) {
    throw new Error("Unable to create or fetch invited user.");
  }

  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id: user.id,
      email,
      account_status: "invited",
      stage: "1",
      verification_status: "unverified",
    },
    { onConflict: "id" },
  );

  if (profileError) throw profileError;

  const { error: roleError } = await admin.from("user_roles").upsert(
    {
      user_id: user.id,
      role: "member",
    },
    { onConflict: "user_id" },
  );

  if (roleError) throw roleError;

  console.log("Invited account ready:");
  console.log(`email: ${email}`);
  console.log(`password: ${password}`);
  console.log(`user_id: ${user.id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
