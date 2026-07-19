const SESSION_COOKIE = "hybrid_session";
const TOKEN_TTL_SECONDS = 15 * 60;
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 90;
const MAX_JSON_BYTES = 768 * 1024;
const MAX_PHOTO_BYTES = 6 * 1024 * 1024;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/") && env.ASSETS) return env.ASSETS.fetch(request);
    if (request.method === "OPTIONS") return corsResponse(request, env);

    try {
      if (isStateChangingRequest(request) && !isAllowedOrigin(request, env)) return json({ error: "Origin not allowed" }, 403, request, env);
      if (url.pathname === "/api/auth/magic-link" && request.method === "POST") return await requestMagicLink(request, env);
      if (url.pathname === "/api/auth/verify" && request.method === "GET") return await verifyMagicLink(request, env);
      if (url.pathname === "/api/auth/logout" && request.method === "POST") return await logout(request, env);
      if (url.pathname === "/api/device/create" && request.method === "POST") return await createDeviceAccount(request, env);
      if (url.pathname === "/api/device/restore" && request.method === "POST") return await restoreDeviceAccount(request, env);
      if (url.pathname === "/api/session" && request.method === "GET") return await sessionResponse(request, env);
      if (url.pathname === "/api/sync/push" && request.method === "POST") return await syncPush(request, env);
      if (url.pathname === "/api/sync/pull" && request.method === "GET") return await syncPull(request, env);
      if (url.pathname === "/api/friends/add" && request.method === "POST") return await addFriend(request, env);
      if (url.pathname === "/api/friends/requests" && request.method === "GET") return await friendRequests(request, env);
      if (url.pathname === "/api/friends/accept" && request.method === "POST") return await respondFriendRequest(request, env, "accepted");
      if (url.pathname === "/api/friends/reject" && request.method === "POST") return await respondFriendRequest(request, env, "rejected");
      if (url.pathname === "/api/friends/remove" && request.method === "POST") return await removeFriend(request, env);
      if (url.pathname === "/api/friends/block" && request.method === "POST") return await blockFriend(request, env);
      if (url.pathname === "/api/friends/progress" && request.method === "GET") return await friendsProgress(request, env);
      if (url.pathname === "/api/account/export" && request.method === "GET") return await accountExport(request, env);
      if (url.pathname === "/api/account/delete" && request.method === "POST") return await accountDelete(request, env);
      if (url.pathname.startsWith("/api/barcode/") && request.method === "GET") return await barcodeLookup(request, env);
      if (url.pathname === "/api/nutrition/photo/analyse" && request.method === "POST") return await photoAnalyse(request, env);
      if (url.pathname === "/api/health" && request.method === "GET") return await healthCheck(request, env);
      return json({ error: "Not found" }, 404, request, env);
    } catch (error) {
      if (error instanceof Response) return withCors(error, request, env);
      console.error("Worker error", error);
      return json({ error: "Server error" }, 500, request, env);
    }
  }
};

async function createDeviceAccount(request, env) {
  await ensureRecoverySchema(env);
  const body = await readJsonBody(request);
  const now = new Date().toISOString();
  const userId = crypto.randomUUID();
  const displayName = cleanDisplayName(body.displayName) || "Hybrid athlete";
  const recoveryCode = await uniqueRecoveryCode(env);
  const friendCode = await uniqueFriendCode(env);
  const recoveryHash = await recoveryCodeHash(recoveryCode, env);
  const email = `anon-${userId}@hybrid.local`;

  await env.DB.prepare(`
    INSERT INTO users (id, email, display_name, timezone, units, created_at, updated_at, last_login_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(userId, email, displayName, body.timezone || "Australia/Brisbane", body.units || "metric", now, now, now).run();
  await env.DB.prepare(`
    INSERT INTO recovery_accounts (user_id, recovery_code_hash, friend_code, created_at)
    VALUES (?, ?, ?, ?)
  `).bind(userId, recoveryHash, friendCode, now).run();
  await logAuth(env, userId, "recovery_account_created", request);

  const session = await createSession(env, userId, now);
  return json({
    ok: true,
    user: userPayload({
      id: userId,
      email: "",
      display_name: displayName,
      created_at: now,
      updated_at: now,
      last_login_at: now,
      timezone: body.timezone || "Australia/Brisbane",
      units: body.units || "metric",
      friend_code: friendCode
    }),
    recoveryCode,
    friendCode
  }, 200, request, env, sessionCookie(session.token, session.expiresAt));
}

async function restoreDeviceAccount(request, env) {
  await ensureRecoverySchema(env);
  const body = await readJsonBody(request);
  const recoveryCode = normalizeRecoveryCode(body.recoveryCode || body.code || "");
  if (!recoveryCode) return json({ error: "Recovery code is required" }, 400, request, env);
  const recoveryHash = await recoveryCodeHash(recoveryCode, env);
  const row = await env.DB.prepare(`
    SELECT users.*, recovery_accounts.friend_code
    FROM recovery_accounts
    JOIN users ON users.id = recovery_accounts.user_id
    WHERE recovery_accounts.recovery_code_hash = ? AND users.deleted_at IS NULL
    LIMIT 1
  `).bind(recoveryHash).first();
  if (!row) return json({ error: "Recovery code was not recognised" }, 404, request, env);

  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE recovery_accounts SET last_used_at = ? WHERE user_id = ?").bind(now, row.id).run();
  await env.DB.prepare("UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?").bind(now, now, row.id).run();
  await logAuth(env, row.id, "recovery_account_restored", request);
  const session = await createSession(env, row.id, now);
  return json({ ok: true, user: userPayload({ ...row, last_login_at: now, updated_at: now }), recoveryCode, friendCode: row.friend_code }, 200, request, env, sessionCookie(session.token, session.expiresAt));
}

async function requestMagicLink(request, env) {
  const body = await readJsonBody(request);
  const email = normalizeEmail(body.email);
  if (!email) return json({ error: "Valid email is required" }, 400, request, env);
  if (!emailDeliveryConfigured(env)) return json({ error: "Email provider is not configured" }, 503, request, env);
  await rateLimitMagicLink(request, env, email);

  const now = new Date().toISOString();
  const userId = await upsertUser(env, email, body.timezone || "Australia/Brisbane", body.units || "metric", now);
  const token = randomToken();
  const tokenHash = await sha256(token + env.SESSION_SECRET);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_SECONDS * 1000).toISOString();

  await env.DB.prepare(`
    INSERT INTO magic_links (id, user_id, token_hash, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(crypto.randomUUID(), userId, tokenHash, expiresAt, now).run();

  const link = `${env.APP_ORIGIN}/api/auth/verify?token=${encodeURIComponent(token)}`;
  await logAuth(env, userId, "magic_link_requested", request);
  await sendMagicLinkEmail(env, email, link);

  return json({
    ok: true,
    devMagicLink: env.DEV_MODE === "true" ? link : undefined
  }, 200, request, env);
}

async function verifyMagicLink(request, env) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  const tokenHash = await sha256(token + env.SESSION_SECRET);
  const row = await env.DB.prepare(`
    SELECT * FROM magic_links
    WHERE token_hash = ? AND used_at IS NULL AND expires_at > datetime('now')
    LIMIT 1
  `).bind(tokenHash).first();
  if (!row) return html("Magic link is invalid or expired.", 401, request, env);

  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE magic_links SET used_at = ? WHERE id = ?").bind(now, row.id).run();
  await env.DB.prepare("UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?").bind(now, now, row.user_id).run();

  const session = await createSession(env, row.user_id, now);
  await logAuth(env, row.user_id, "magic_link_verified", request);

  return html(`<script>location.href='${env.APP_ORIGIN.replace(/'/g, "")}'</script>Signed in.`, 200, request, env, sessionCookie(session.token, session.expiresAt));
}

async function sessionResponse(request, env) {
  const session = await requireSession(request, env, false);
  return json({ user: session?.user || null }, 200, request, env);
}

async function logout(request, env) {
  const token = cookieValue(request.headers.get("Cookie") || "", SESSION_COOKIE);
  if (token) {
    const hash = await sha256(token + env.SESSION_SECRET);
    await env.DB.prepare("DELETE FROM sessions WHERE session_hash = ?").bind(hash).run();
  }
  return json({ ok: true }, 200, request, env, expiredCookie());
}

async function syncPush(request, env) {
  const session = await requireSession(request, env);
  const body = await readJsonBody(request);
  const now = new Date().toISOString();
  if (!body || typeof body !== "object" || !body.snapshot || typeof body.snapshot !== "object") return json({ error: "Valid snapshot is required" }, 400, request, env);
  const snapshot = { ...body.snapshot };
  snapshot.auth = undefined;
  const payload = JSON.stringify(snapshot);
  if (payload.length > MAX_JSON_BYTES) return json({ error: "Snapshot is too large" }, 413, request, env);

  await env.DB.prepare(`
    INSERT INTO records (id, user_id, type, payload, revision, device_id, updated_at, created_at)
    VALUES (?, ?, 'snapshot', ?, 1, ?, ?, ?)
    ON CONFLICT(id, user_id) DO UPDATE SET
      payload = excluded.payload,
      revision = records.revision + 1,
      device_id = excluded.device_id,
      updated_at = excluded.updated_at,
      deleted_at = NULL
  `).bind("snapshot", session.user.id, payload, safeText(body.deviceId, 100), now, now).run();

  for (const change of Array.isArray(body.outbox) ? body.outbox.slice(0, 200) : []) {
    await env.DB.prepare(`
      INSERT OR IGNORE INTO sync_journal (id, user_id, device_id, reason, payload, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(safeText(change.id || crypto.randomUUID(), 120), session.user.id, safeText(body.deviceId, 100), safeText(change.reason || "change", 80), JSON.stringify(change).slice(0, 65536), change.createdAt || now).run();
  }

  return json({ ok: true, syncedAt: now }, 200, request, env);
}

async function syncPull(request, env) {
  const session = await requireSession(request, env);
  const row = await env.DB.prepare("SELECT payload, revision, updated_at FROM records WHERE id = 'snapshot' AND user_id = ? AND deleted_at IS NULL")
    .bind(session.user.id).first();
  return json({ snapshot: row ? JSON.parse(row.payload) : null, revision: row?.revision || 0, updatedAt: row?.updated_at || "" }, 200, request, env);
}

async function addFriend(request, env) {
  await ensureRecoverySchema(env);
  const session = await requireSession(request, env);
  const body = await readJsonBody(request);
  const friendCode = normalizeFriendCode(body.friendCode || "");
  if (!friendCode) return json({ error: "Friend code is required" }, 400, request, env);

  const friend = await env.DB.prepare(`
    SELECT users.*, recovery_accounts.friend_code
    FROM recovery_accounts
    JOIN users ON users.id = recovery_accounts.user_id
    WHERE recovery_accounts.friend_code = ? AND users.deleted_at IS NULL
    LIMIT 1
  `).bind(friendCode).first();
  if (!friend) return json({ error: "Friend code was not recognised" }, 404, request, env);
  if (friend.id === session.user.id) return json({ error: "That is your own friend code" }, 400, request, env);

  const now = new Date().toISOString();
  const blocked = await env.DB.prepare(`
    SELECT status
    FROM friendships
    WHERE ((user_id = ? AND friend_user_id = ?)
       OR (user_id = ? AND friend_user_id = ?))
      AND status = 'blocked'
    LIMIT 1
  `).bind(session.user.id, friend.id, friend.id, session.user.id).first();
  if (blocked?.status === "blocked") return json({ error: "Friend request is not available" }, 403, request, env);
  const existing = await env.DB.prepare(`
    SELECT status
    FROM friendships
    WHERE user_id = ? AND friend_user_id = ?
    LIMIT 1
  `).bind(session.user.id, friend.id).first();
  if (existing?.status === "accepted") return json({ ok: true, status: "accepted", friend: publicFriendPayload(friend) }, 200, request, env);
  const reverse = await env.DB.prepare(`
    SELECT status
    FROM friendships
    WHERE user_id = ? AND friend_user_id = ?
    LIMIT 1
  `).bind(friend.id, session.user.id).first();
  if (reverse?.status === "accepted") {
    await env.DB.prepare(`
      INSERT INTO friendships (user_id, friend_user_id, status, created_at, updated_at)
      VALUES (?, ?, 'accepted', ?, ?)
      ON CONFLICT(user_id, friend_user_id) DO UPDATE SET status = 'accepted', updated_at = excluded.updated_at
    `).bind(session.user.id, friend.id, now, now).run();
    return json({ ok: true, status: "accepted", friend: publicFriendPayload(friend) }, 200, request, env);
  }
  if (reverse?.status === "pending") return json({ error: "This mate has already sent you a request. Accept it from Requests." }, 409, request, env);
  await env.DB.prepare(`
    INSERT INTO friendships (user_id, friend_user_id, status, created_at, updated_at)
    VALUES (?, ?, 'pending', ?, ?)
    ON CONFLICT(user_id, friend_user_id) DO UPDATE SET
      status = CASE WHEN friendships.status = 'blocked' THEN friendships.status ELSE 'pending' END,
      updated_at = excluded.updated_at
  `).bind(session.user.id, friend.id, now, now).run();
  return json({ ok: true, status: "pending", friend: publicFriendPayload(friend) }, 200, request, env);
}

async function friendRequests(request, env) {
  await ensureRecoverySchema(env);
  const session = await requireSession(request, env);
  const rows = await env.DB.prepare(`
    SELECT users.display_name, users.updated_at, recovery_accounts.friend_code, friendships.created_at, friendships.status
    FROM friendships
    JOIN users ON users.id = friendships.user_id
    LEFT JOIN recovery_accounts ON recovery_accounts.user_id = users.id
    WHERE friendships.friend_user_id = ? AND friendships.status = 'pending' AND users.deleted_at IS NULL
    ORDER BY friendships.created_at DESC
  `).bind(session.user.id).all();
  const requests = (rows.results || []).map((row) => ({
    ...publicFriendPayload(row),
    status: "pending",
    requestedAt: row.created_at || ""
  }));
  return json({ ok: true, requests, fetchedAt: new Date().toISOString() }, 200, request, env);
}

async function respondFriendRequest(request, env, status) {
  await ensureRecoverySchema(env);
  const session = await requireSession(request, env);
  const friend = await friendFromRequestBody(request, env);
  if (!friend) return json({ error: "Friend code was not recognised" }, 404, request, env);
  const pending = await env.DB.prepare(`
    SELECT status
    FROM friendships
    WHERE user_id = ? AND friend_user_id = ? AND status = 'pending'
    LIMIT 1
  `).bind(friend.id, session.user.id).first();
  if (!pending) return json({ error: "No pending friend request found" }, 404, request, env);

  const now = new Date().toISOString();
  if (status === "accepted") {
    await env.DB.prepare("UPDATE friendships SET status = 'accepted', updated_at = ? WHERE user_id = ? AND friend_user_id = ?")
      .bind(now, friend.id, session.user.id).run();
    await env.DB.prepare(`
      INSERT INTO friendships (user_id, friend_user_id, status, created_at, updated_at)
      VALUES (?, ?, 'accepted', ?, ?)
      ON CONFLICT(user_id, friend_user_id) DO UPDATE SET status = 'accepted', updated_at = excluded.updated_at
    `).bind(session.user.id, friend.id, now, now).run();
    return json({ ok: true, status: "accepted", friend: publicFriendPayload(friend) }, 200, request, env);
  }

  await env.DB.prepare("UPDATE friendships SET status = 'rejected', updated_at = ? WHERE user_id = ? AND friend_user_id = ?")
    .bind(now, friend.id, session.user.id).run();
  return json({ ok: true, status: "rejected" }, 200, request, env);
}

async function removeFriend(request, env) {
  await ensureRecoverySchema(env);
  const session = await requireSession(request, env);
  const friend = await friendFromRequestBody(request, env);
  if (!friend) return json({ error: "Friend code was not recognised" }, 404, request, env);
  const now = new Date().toISOString();
  await env.DB.prepare(`
    UPDATE friendships
    SET status = 'removed', updated_at = ?
    WHERE (user_id = ? AND friend_user_id = ?) OR (user_id = ? AND friend_user_id = ?)
  `).bind(now, session.user.id, friend.id, friend.id, session.user.id).run();
  return json({ ok: true, status: "removed" }, 200, request, env);
}

async function blockFriend(request, env) {
  await ensureRecoverySchema(env);
  const session = await requireSession(request, env);
  const friend = await friendFromRequestBody(request, env);
  if (!friend) return json({ error: "Friend code was not recognised" }, 404, request, env);
  const now = new Date().toISOString();
  await env.DB.prepare(`
    INSERT INTO friendships (user_id, friend_user_id, status, created_at, updated_at)
    VALUES (?, ?, 'blocked', ?, ?)
    ON CONFLICT(user_id, friend_user_id) DO UPDATE SET status = 'blocked', updated_at = excluded.updated_at
  `).bind(session.user.id, friend.id, now, now).run();
  await env.DB.prepare(`
    UPDATE friendships
    SET status = 'removed', updated_at = ?
    WHERE user_id = ? AND friend_user_id = ? AND status != 'blocked'
  `).bind(now, friend.id, session.user.id).run();
  return json({ ok: true, status: "blocked" }, 200, request, env);
}

async function friendsProgress(request, env) {
  await ensureRecoverySchema(env);
  const session = await requireSession(request, env);
  const rows = await env.DB.prepare(`
    SELECT users.id, users.display_name, users.updated_at, recovery_accounts.friend_code
    FROM friendships
    JOIN users ON users.id = friendships.friend_user_id
    LEFT JOIN recovery_accounts ON recovery_accounts.user_id = users.id
    WHERE friendships.user_id = ? AND friendships.status = 'accepted' AND users.deleted_at IS NULL
    ORDER BY users.display_name COLLATE NOCASE
  `).bind(session.user.id).all();

  const friends = [];
  for (const friend of rows.results || []) {
    const snapshotRow = await env.DB.prepare(`
      SELECT payload, updated_at
      FROM records
      WHERE user_id = ? AND type = 'snapshot' AND deleted_at IS NULL
      ORDER BY updated_at DESC
      LIMIT 1
    `).bind(friend.id).first();
    let snapshot = null;
    if (snapshotRow?.payload) {
      try {
        snapshot = JSON.parse(snapshotRow.payload);
      } catch (_) {
        snapshot = null;
      }
    }
    friends.push({
      ...publicFriendPayload(friend),
      progress: summarizeProgressSnapshot(snapshot, snapshotRow?.updated_at || friend.updated_at)
    });
  }

  return json({ ok: true, friends, fetchedAt: new Date().toISOString() }, 200, request, env);
}

async function accountExport(request, env) {
  const session = await requireSession(request, env);
  const rows = await env.DB.prepare("SELECT type, payload, updated_at FROM records WHERE user_id = ? AND deleted_at IS NULL").bind(session.user.id).all();
  return json({ exportedAt: new Date().toISOString(), user: session.user, records: rows.results || [] }, 200, request, env);
}

async function accountDelete(request, env) {
  const session = await requireSession(request, env);
  const body = await readJsonBody(request);
  if (body.confirmation !== "DELETE") return json({ error: "Confirmation text DELETE is required" }, 400, request, env);
  const now = new Date().toISOString();
  await env.DB.prepare("UPDATE records SET deleted_at = ?, updated_at = ? WHERE user_id = ?").bind(now, now, session.user.id).run();
  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(session.user.id).run();
  await env.DB.prepare("UPDATE users SET deleted_at = ?, updated_at = ? WHERE id = ?").bind(now, now, session.user.id).run();
  await logAuth(env, session.user.id, "account_deleted", request);
  return json({ ok: true }, 200, request, env, expiredCookie());
}

async function barcodeLookup(request, env) {
  await requireSession(request, env);
  const code = new URL(request.url).pathname.split("/").pop();
  if (!/^\d{6,18}$/.test(code || "")) return json({ error: "Valid numeric barcode is required" }, 400, request, env);
  await rateLimitBucket(env, `barcode:${request.headers.get("CF-Connecting-IP") || "unknown"}`, 60, 60 * 60 * 1000);
  const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json`, {
    headers: { "User-Agent": env.OPEN_FOOD_FACTS_USER_AGENT || "HybridTracker/0.4.0" }
  });
  if (!response.ok) return json({ error: "Barcode source unavailable" }, 502, request, env);
  return json(await response.json(), 200, request, env);
}

async function photoAnalyse(request, env) {
  await requireSession(request, env);
  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength && contentLength > MAX_PHOTO_BYTES) return json({ error: "Image must be under 6 MB" }, 413, request, env);
  const form = await request.formData();
  const image = form.get("image");
  const type = String(image?.type || "").toLowerCase();
  if (!image || !["image/jpeg", "image/png", "image/webp"].includes(type)) return json({ error: "JPEG, PNG or WebP image is required" }, 400, request, env);
  if (image.size > MAX_PHOTO_BYTES) return json({ error: "Image must be under 6 MB" }, 413, request, env);

  const imageId = crypto.randomUUID();
  if (env.FOOD_IMAGES) {
    await env.FOOD_IMAGES.put(`food/${imageId}`, image.stream(), { httpMetadata: { contentType: image.type } });
  }

  return json({
    imageId,
    confidence: 0.35,
    note: "AI provider not configured. Returning a low-confidence placeholder that must be edited.",
    items: [
      { name: "Meal photo estimate", portion: "1 plate", calories: 650, protein: 35, carbs: 70, fat: 22, fibre: 6, confidence: 0.35 }
    ]
  }, 200, request, env);
}

async function healthCheck(request, env) {
  const emailProvider = configuredEmailProvider(env);
  const health = {
    ok: true,
    appOrigin: env.APP_ORIGIN || "",
    hasDatabase: !!env.DB,
    hasSessionSecret: !!env.SESSION_SECRET,
    emailProvider,
    hasEmailProvider: !!env.EMAIL_PROVIDER_API_KEY && !!env.EMAIL_FROM_ADDRESS,
    hasEmailProviderApiKey: !!env.EMAIL_PROVIDER_API_KEY,
    hasEmailFromAddress: !!env.EMAIL_FROM_ADDRESS,
    checkedAt: new Date().toISOString()
  };
  if (!env.DB) return json({ ...health, ok: false, database: "missing" }, 200, request, env);
  try {
    const row = await env.DB.prepare("SELECT 1 AS ok").first();
    return json({ ...health, database: row?.ok === 1 ? "ok" : "unknown" }, 200, request, env);
  } catch (_) {
    return json({ ...health, ok: false, database: "error", error: "D1 check failed" }, 200, request, env);
  }
}

async function requireSession(request, env, required = true) {
  const token = cookieValue(request.headers.get("Cookie") || "", SESSION_COOKIE);
  if (!token) {
    if (required) throw new Response("Unauthorized", { status: 401 });
    return null;
  }
  await ensureRecoverySchema(env);
  const hash = await sha256(token + env.SESSION_SECRET);
  const row = await env.DB.prepare(`
    SELECT sessions.id AS session_id, users.*, recovery_accounts.friend_code
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    LEFT JOIN recovery_accounts ON recovery_accounts.user_id = users.id
    WHERE sessions.session_hash = ? AND sessions.expires_at > datetime('now') AND users.deleted_at IS NULL
    LIMIT 1
  `).bind(hash).first();
  if (!row) {
    if (required) throw new Response("Unauthorized", { status: 401 });
    return null;
  }
  await env.DB.prepare("UPDATE sessions SET last_seen_at = ? WHERE id = ?").bind(new Date().toISOString(), row.session_id).run();
  return { user: userPayload(row) };
}

async function upsertUser(env, email, timezone, units, now) {
  const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ? AND deleted_at IS NULL").bind(email).first();
  if (existing) return existing.id;
  const id = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO users (id, email, display_name, timezone, units, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(id, email, email.split("@")[0], timezone, units, now, now).run();
  return id;
}

async function createSession(env, userId, now = new Date().toISOString()) {
  const token = randomToken();
  const hash = await sha256(token + env.SESSION_SECRET);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  await env.DB.prepare(`
    INSERT INTO sessions (id, user_id, session_hash, expires_at, created_at, last_seen_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(crypto.randomUUID(), userId, hash, expiresAt, now, now).run();
  return { token, expiresAt };
}

async function readJsonBody(request, maxBytes = MAX_JSON_BYTES) {
  const contentType = request.headers.get("Content-Type") || "";
  if (request.method !== "GET" && contentType && !contentType.toLowerCase().includes("application/json")) {
    throw jsonError("Content-Type must be application/json", 415);
  }
  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength && contentLength > maxBytes) throw jsonError("Request body is too large", 413);
  try {
    const rawBody = await request.text();
    if (rawBody.length > maxBytes) throw jsonError("Request body is too large", 413);
    return rawBody ? JSON.parse(rawBody) : {};
  } catch (error) {
    if (error instanceof Response) throw error;
    throw jsonError("Invalid JSON body", 400);
  }
}

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), { status, headers: { "Content-Type": "application/json" } });
}

async function ensureRecoverySchema(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS recovery_accounts (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      recovery_code_hash TEXT NOT NULL UNIQUE,
      friend_code TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      last_used_at TEXT
    )
  `).run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_recovery_accounts_hash ON recovery_accounts(recovery_code_hash)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_recovery_accounts_friend_code ON recovery_accounts(friend_code)").run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS friendships (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      friend_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (user_id, friend_user_id)
    )
  `).run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_friendships_friend ON friendships(friend_user_id)").run();
  await env.DB.prepare("UPDATE friendships SET status = 'accepted' WHERE status = 'active'").run();
}

function userPayload(row) {
  return {
    id: row.id,
    email: isAnonymousEmail(row.email) ? "" : row.email,
    displayName: row.display_name || "Hybrid athlete",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at,
    timezone: row.timezone,
    units: row.units,
    friendCode: row.friend_code || "",
    authMode: row.friend_code ? "recovery-code" : "email"
  };
}

function publicFriendPayload(row) {
  return {
    displayName: row.display_name || "Hybrid athlete",
    friendCode: row.friend_code || ""
  };
}

async function friendFromRequestBody(request, env) {
  const body = await readJsonBody(request);
  const friendCode = normalizeFriendCode(body.friendCode || "");
  if (!friendCode) return null;
  return env.DB.prepare(`
    SELECT users.id, users.display_name, users.updated_at, recovery_accounts.friend_code
    FROM recovery_accounts
    JOIN users ON users.id = recovery_accounts.user_id
    WHERE recovery_accounts.friend_code = ? AND users.deleted_at IS NULL
    LIMIT 1
  `).bind(friendCode).first();
}

function safeText(value, limit = 120) {
  return String(value || "").trim().slice(0, limit);
}

function isAnonymousEmail(email) {
  return /^anon-[a-f0-9-]+@hybrid\.local$/i.test(String(email || ""));
}

function cleanDisplayName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 40);
}

async function uniqueRecoveryCode(env) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = `HT-${codeChunk(4)}-${codeChunk(4)}-${codeChunk(4)}`;
    const hash = await recoveryCodeHash(code, env);
    const existing = await env.DB.prepare("SELECT user_id FROM recovery_accounts WHERE recovery_code_hash = ?").bind(hash).first();
    if (!existing) return code;
  }
  throw new Error("Could not create recovery code");
}

async function uniqueFriendCode(env) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = `FR-${codeChunk(4)}-${codeChunk(4)}`;
    const existing = await env.DB.prepare("SELECT user_id FROM recovery_accounts WHERE friend_code = ?").bind(code).first();
    if (!existing) return code;
  }
  throw new Error("Could not create friend code");
}

function codeChunk(length) {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => alphabet[byte % alphabet.length]).join("");
}

function normalizeRecoveryCode(value) {
  const clean = String(value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!clean) return "";
  const body = clean.startsWith("HT") ? clean.slice(2) : clean;
  if (body.length !== 12) return "";
  return `HT-${body.slice(0, 4)}-${body.slice(4, 8)}-${body.slice(8, 12)}`;
}

function normalizeFriendCode(value) {
  const clean = String(value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!clean) return "";
  const body = clean.startsWith("FR") ? clean.slice(2) : clean;
  if (body.length !== 8) return "";
  return `FR-${body.slice(0, 4)}-${body.slice(4, 8)}`;
}

async function recoveryCodeHash(code, env) {
  return sha256(normalizeRecoveryCode(code) + env.SESSION_SECRET);
}

function summarizeProgressSnapshot(snapshot, updatedAt) {
  if (!snapshot) return { updatedAt: updatedAt || "", hasData: false };
  const today = isoDate();
  const weekStart = startOfWeek(today);
  const weekEnd = addDaysIso(weekStart, 6);
  const runs = Object.entries(snapshot.runs || {}).map(([runId, log]) => ({ runId, date: dateFromRunId(runId), ...log }));
  const weeklyRuns = runs.filter((run) => run.date >= weekStart && run.date <= weekEnd);
  const gymLogs = Object.values(snapshot.gymLogs || {}).filter((session) => session.date >= weekStart && session.date <= weekEnd);
  const metrics = Array.isArray(snapshot.metrics) ? [...snapshot.metrics].sort((a, b) => String(a.date || "").localeCompare(String(b.date || ""))) : [];
  const latestMetric = metrics[metrics.length - 1] || {};
  const completedRuns = weeklyRuns.filter((run) => run.status === "completed");
  const gymCompleted = gymLogs.filter((session) => session.status === "completed");
  return {
    updatedAt: updatedAt || "",
    hasData: true,
    weeklyRunKm: round(weeklyRuns.reduce((sum, run) => sum + numberValue(run.actualDistance), 0), 1),
    completedRuns: completedRuns.length,
    gymSessions: gymCompleted.length,
    gymVolume: Math.round(gymLogs.reduce((sum, session) => sum + gymVolume(session), 0)),
    latestBodyweight: latestMetric.bodyweight ? numberValue(latestMetric.bodyweight) : null,
    soreness: latestMetric.soreness || "",
    fatigue: latestMetric.fatigue || "",
    stretchCompletions: Object.values(snapshot.stretchingLogs || {}).filter((log) => log.status === "completed").length,
    lastWorkoutDate: latestDate([
      ...completedRuns.map((run) => run.date),
      ...gymCompleted.map((session) => session.date)
    ])
  };
}

function gymVolume(session) {
  return (session.exercises || []).reduce((sum, exercise) => sum + (exercise.sets || []).reduce((setSum, set) => {
    if (!set.completed) return setSum;
    return setSum + numberValue(set.weight) * numberValue(set.reps);
  }, 0), 0);
}

function numberValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function round(value, places = 1) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function isoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function startOfWeek(date) {
  const d = new Date(`${date}T00:00:00Z`);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDaysIso(date, diff);
}

function addDaysIso(date, days) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function dateFromRunId(runId) {
  const match = String(runId || "").match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : "";
}

function latestDate(dates) {
  return dates.filter(Boolean).sort().pop() || "";
}

async function sendMagicLinkEmail(env, email, link) {
  const provider = configuredEmailProvider(env);
  const response = provider === "postmark"
    ? await sendPostmarkEmail(env, email, link)
    : await sendResendEmail(env, email, link);
  if (!response.ok) throw new Error("Email delivery failed");
}

function configuredEmailProvider(env) {
  const provider = String(env.EMAIL_PROVIDER || "postmark").trim().toLowerCase();
  return provider === "resend" ? "resend" : "postmark";
}

function emailDeliveryConfigured(env) {
  return env.DEV_MODE === "true" || (!!env.EMAIL_PROVIDER_API_KEY && !!env.EMAIL_FROM_ADDRESS);
}

async function sendPostmarkEmail(env, email, link) {
  return fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": env.EMAIL_PROVIDER_API_KEY
    },
    body: JSON.stringify({
      From: env.EMAIL_FROM_ADDRESS,
      To: email,
      Subject: "Your Hybrid Tracker sign-in link",
      HtmlBody: `<p>Sign in to Hybrid Tracker:</p><p><a href="${link}">Open magic link</a></p><p>This link expires in 15 minutes and can only be used once.</p>`,
      TextBody: `Sign in to Hybrid Tracker: ${link}\n\nThis link expires in 15 minutes and can only be used once.`,
      MessageStream: "outbound"
    })
  });
}

async function sendResendEmail(env, email, link) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${env.EMAIL_PROVIDER_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.EMAIL_FROM_ADDRESS,
      to: email,
      subject: "Your Hybrid Tracker sign-in link",
      html: `<p>Sign in to Hybrid Tracker:</p><p><a href="${link}">Open magic link</a></p><p>This link expires in 15 minutes and can only be used once.</p>`
    })
  });
}

async function rateLimitMagicLink(request, env, email) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  await rateLimitBucket(env, `magic:ip:${ip}`, 5, 15 * 60 * 1000);
  await rateLimitBucket(env, `magic:email:${await sha256(email)}`, 5, 15 * 60 * 1000);
}

async function rateLimitBucket(env, id, maxRequests, windowMs) {
  const row = await env.DB.prepare("SELECT count, reset_at FROM rate_limits WHERE id = ?").bind(id).first();
  const now = Date.now();
  if (row && Date.parse(row.reset_at) > now && row.count >= maxRequests) throw jsonError("Too many requests. Try again later.", 429);
  const resetAt = new Date(now + windowMs).toISOString();
  await env.DB.prepare(`
    INSERT INTO rate_limits (id, count, reset_at)
    VALUES (?, 1, ?)
    ON CONFLICT(id) DO UPDATE SET
      count = CASE WHEN reset_at < datetime('now') THEN 1 ELSE count + 1 END,
      reset_at = CASE WHEN reset_at < datetime('now') THEN excluded.reset_at ELSE reset_at END
  `).bind(id, resetAt).run();
}

async function logAuth(env, userId, event, request) {
  await env.DB.prepare(`
    INSERT INTO auth_events (id, user_id, event, ip, user_agent, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(crypto.randomUUID(), userId, event, request.headers.get("CF-Connecting-IP") || "", request.headers.get("User-Agent") || "", new Date().toISOString()).run();
}

function corsResponse(request, env) {
  if (!isAllowedOrigin(request, env)) return new Response(null, { status: 403, headers: corsHeaders(request, env) });
  return new Response(null, { status: 204, headers: corsHeaders(request, env) });
}

function withCors(response, request, env) {
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders(request, env)).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function json(payload, status, request, env, cookie) {
  const headers = { "Content-Type": "application/json", ...corsHeaders(request, env) };
  if (cookie) headers["Set-Cookie"] = cookie;
  return new Response(JSON.stringify(payload), { status, headers });
}

function html(payload, status, request, env, cookie) {
  const headers = { "Content-Type": "text/html; charset=utf-8", ...corsHeaders(request, env) };
  if (cookie) headers["Set-Cookie"] = cookie;
  return new Response(payload, { status, headers });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigin = allowedOrigins(env).includes(origin) ? origin : env.APP_ORIGIN || "https://hybrid-tracker.pages.dev";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  };
}

function allowedOrigins(env) {
  return [env.APP_ORIGIN, env.LOCAL_APP_ORIGIN, "https://hybrid-tracker.pages.dev"].filter(Boolean);
}

function isAllowedOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  return !origin || allowedOrigins(env).includes(origin);
}

function isStateChangingRequest(request) {
  return !["GET", "HEAD", "OPTIONS"].includes(request.method);
}

function sessionCookie(token, expiresAt) {
  return `${SESSION_COOKIE}=${token}; Path=/; Expires=${new Date(expiresAt).toUTCString()}; HttpOnly; Secure; SameSite=Lax`;
}

function expiredCookie() {
  return `${SESSION_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`;
}

function cookieValue(cookieHeader, name) {
  return cookieHeader.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1) || "";
}

function normalizeEmail(email) {
  const value = String(email || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : "";
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256(value) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
