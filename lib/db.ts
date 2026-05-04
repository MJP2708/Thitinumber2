import "server-only";

import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { defaultCandidate, defaultPolicies, type Candidate, type FeedbackItem, type Policy } from "@/lib/defaultData";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  return pool;
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getPool();
      await db.query(`
        create table if not exists candidate_info (
          id integer primary key default 1,
          name text not null,
          number integer not null,
          slogan text not null,
          grade text not null,
          bio text not null,
          ideology text not null,
          mission text not null,
          vision text not null,
          reason_for_running text not null,
          election_date date not null,
          video_url text not null default '',
          video_title text not null default '',
          video_description text not null default '',
          hero_image text not null default '',
          about_image text not null default '',
          instagram_url text not null default '',
          updated_at timestamptz not null default now()
        );
      `);

      await db.query("alter table candidate_info add column if not exists instagram_url text not null default '';");

      await db.query(`
        create table if not exists policies (
          id text primary key,
          title text not null,
          category text not null,
          description text not null,
          impact text not null,
          icon text not null,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        );
      `);

      await db.query(`
        create table if not exists admin_users (
          id serial primary key,
          username text unique not null,
          password_hash text not null,
          created_at timestamptz not null default now()
        );
      `);

      await db.query(`
        create table if not exists feedback (
          id text primary key,
          name text not null default '',
          grade text,
          category text not null,
          message text not null,
          timestamp timestamptz not null default now(),
          is_read boolean not null default false,
          likes integer not null default 0
        );
      `);

      await seedDefaults();
      await normalizeCandidateName();
      await seedAdminUser();
    })();
  }

  return schemaReady;
}

function rowToCandidate(row: Record<string, unknown>): Candidate {
  const electionDate =
    row.election_date instanceof Date
      ? row.election_date.toISOString().slice(0, 10)
      : String(row.election_date || defaultCandidate.electionDate).slice(0, 10);

  return {
    name: String(row.name),
    number: Number(row.number),
    slogan: String(row.slogan),
    grade: String(row.grade),
    bio: String(row.bio),
    ideology: String(row.ideology),
    mission: String(row.mission),
    vision: String(row.vision),
    reasonForRunning: String(row.reason_for_running),
    electionDate,
    videoUrl: String(row.video_url || ""),
    videoTitle: String(row.video_title || ""),
    videoDescription: String(row.video_description || ""),
    heroImage: String(row.hero_image || ""),
    aboutImage: String(row.about_image || ""),
    instagramUrl: String(row.instagram_url || defaultCandidate.instagramUrl),
  };
}

function rowToPolicy(row: Record<string, unknown>): Policy {
  return {
    id: String(row.id),
    title: String(row.title),
    category: String(row.category),
    description: String(row.description),
    impact: String(row.impact),
    icon: String(row.icon),
  };
}

function rowToFeedback(row: Record<string, unknown>): FeedbackItem {
  const timestamp = row.timestamp instanceof Date ? row.timestamp.toISOString() : String(row.timestamp);
  return {
    id: String(row.id),
    name: String(row.name || ""),
    grade: row.grade ? String(row.grade) : undefined,
    category: String(row.category),
    message: String(row.message),
    timestamp,
    isRead: Boolean(row.is_read),
    likes: Number(row.likes || 0),
  };
}

async function seedDefaults() {
  const db = getPool();

  await db.query(
    `
      insert into candidate_info (
        id, name, number, slogan, grade, bio, ideology, mission, vision,
        reason_for_running, election_date, video_url, video_title,
        video_description, hero_image, about_image, instagram_url
      )
      values (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      on conflict (id) do nothing;
    `,
    [
      defaultCandidate.name,
      defaultCandidate.number,
      defaultCandidate.slogan,
      defaultCandidate.grade,
      defaultCandidate.bio,
      defaultCandidate.ideology,
      defaultCandidate.mission,
      defaultCandidate.vision,
      defaultCandidate.reasonForRunning,
      defaultCandidate.electionDate,
      defaultCandidate.videoUrl,
      defaultCandidate.videoTitle,
      defaultCandidate.videoDescription,
      defaultCandidate.heroImage,
      defaultCandidate.aboutImage,
      defaultCandidate.instagramUrl,
    ]
  );

  const count = await db.query<{ count: string }>("select count(*) from policies");
  if (Number(count.rows[0]?.count || 0) === 0) {
    for (const policy of defaultPolicies) {
      await db.query(
        `
          insert into policies (id, title, category, description, impact, icon)
          values ($1, $2, $3, $4, $5, $6)
          on conflict (id) do nothing;
        `,
        [policy.id, policy.title, policy.category, policy.description, policy.impact, policy.icon]
      );
    }
  }
}

async function normalizeCandidateName() {
  const db = getPool();
  await db.query(
    `
      update candidate_info set
        name = replace(name, 'ฐิติ', 'ธิติ'),
        bio = replace(bio, 'ฐิติ', 'ธิติ'),
        video_description = replace(video_description, 'ฐิติ', 'ธิติ'),
        updated_at = now()
      where id = 1 and (
        name like '%ฐิติ%' or
        bio like '%ฐิติ%' or
        video_description like '%ฐิติ%'
      );
    `
  );
}

export async function getCampaignData() {
  await ensureSchema();
  const db = getPool();
  const [candidateResult, policiesResult, feedbackResult] = await Promise.all([
    db.query("select * from candidate_info where id = 1"),
    db.query("select * from policies order by created_at asc"),
    db.query("select * from feedback order by timestamp desc"),
  ]);

  return {
    candidate: candidateResult.rows[0] ? rowToCandidate(candidateResult.rows[0]) : defaultCandidate,
    policies: policiesResult.rows.map(rowToPolicy),
    feedbackList: feedbackResult.rows.map(rowToFeedback),
  };
}

export async function updateCandidateInfo(candidate: Candidate) {
  await ensureSchema();
  const db = getPool();
  const result = await db.query(
    `
      update candidate_info set
        name = $1,
        number = $2,
        slogan = $3,
        grade = $4,
        bio = $5,
        ideology = $6,
        mission = $7,
        vision = $8,
        reason_for_running = $9,
        election_date = $10,
        video_url = $11,
        video_title = $12,
        video_description = $13,
        hero_image = $14,
        about_image = $15,
        instagram_url = $16,
        updated_at = now()
      where id = 1
      returning *;
    `,
    [
      candidate.name,
      candidate.number,
      candidate.slogan,
      candidate.grade,
      candidate.bio,
      candidate.ideology,
      candidate.mission,
      candidate.vision,
      candidate.reasonForRunning,
      candidate.electionDate,
      candidate.videoUrl,
      candidate.videoTitle,
      candidate.videoDescription,
      candidate.heroImage,
      candidate.aboutImage,
      candidate.instagramUrl,
    ]
  );

  return rowToCandidate(result.rows[0]);
}

export async function updateVideoInfo(data: Pick<Candidate, "videoUrl" | "videoTitle" | "videoDescription">) {
  await ensureSchema();
  const db = getPool();
  const result = await db.query(
    `
      update candidate_info set
        video_url = $1,
        video_title = $2,
        video_description = $3,
        updated_at = now()
      where id = 1
      returning *;
    `,
    [data.videoUrl, data.videoTitle, data.videoDescription]
  );

  return rowToCandidate(result.rows[0]);
}

export async function createPolicy(policy: Omit<Policy, "id">) {
  await ensureSchema();
  const db = getPool();
  const id = crypto.randomUUID();
  const result = await db.query(
    `
      insert into policies (id, title, category, description, impact, icon)
      values ($1, $2, $3, $4, $5, $6)
      returning *;
    `,
    [id, policy.title, policy.category, policy.description, policy.impact, policy.icon]
  );

  return rowToPolicy(result.rows[0]);
}

export async function updatePolicyRecord(id: string, policy: Omit<Policy, "id">) {
  await ensureSchema();
  const db = getPool();
  const result = await db.query(
    `
      update policies set
        title = $2,
        category = $3,
        description = $4,
        impact = $5,
        icon = $6,
        updated_at = now()
      where id = $1
      returning *;
    `,
    [id, policy.title, policy.category, policy.description, policy.impact, policy.icon]
  );

  return result.rows[0] ? rowToPolicy(result.rows[0]) : null;
}

export async function deletePolicyRecord(id: string) {
  await ensureSchema();
  await getPool().query("delete from policies where id = $1", [id]);
}

export async function createFeedback(feedback: Omit<FeedbackItem, "id" | "timestamp" | "isRead" | "likes">) {
  await ensureSchema();
  const db = getPool();
  const id = crypto.randomUUID();
  const result = await db.query(
    `
      insert into feedback (id, name, grade, category, message)
      values ($1, $2, $3, $4, $5)
      returning *;
    `,
    [id, feedback.name || "", feedback.grade || null, feedback.category, feedback.message]
  );

  return rowToFeedback(result.rows[0]);
}

export async function deleteFeedbackRecord(id: string) {
  await ensureSchema();
  await getPool().query("delete from feedback where id = $1", [id]);
}

export async function likeFeedbackRecord(id: string) {
  await ensureSchema();
  const result = await getPool().query(
    "update feedback set likes = likes + 1 where id = $1 returning *",
    [id]
  );

  return result.rows[0] ? rowToFeedback(result.rows[0]) : null;
}

// ─── Admin auth ───────────────────────────────────────────────────────────────

async function seedAdminUser() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.warn("[auth] ADMIN_PASSWORD not set — skipping admin user seed");
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  await getPool().query(
    `insert into admin_users (username, password_hash)
     values ('admin', $1)
     on conflict (username) do update set password_hash = $1`,
    [hash]
  );
}

export async function authenticateAdmin(
  username: string,
  password: string
): Promise<boolean> {
  await ensureSchema();
  const result = await getPool().query<{ password_hash: string }>(
    "select password_hash from admin_users where username = $1 limit 1",
    [username.trim().toLowerCase()]
  );
  const row = result.rows[0];
  if (!row) return false;
  return bcrypt.compare(password, row.password_hash);
}
