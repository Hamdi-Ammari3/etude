// lib/daily.js

const DAILY_API_BASE = "https://api.daily.co/v1";

async function dailyFetch(path, options = {}) {
  const res = await fetch(`${DAILY_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Daily API error (${res.status}): ${body}`);
  }
  return res.json();
}

// privacy: "private" means the room CANNOT be joined by URL alone — a
// valid meeting token (minted per-user, per-role, by the token route)
// is required. That's the actual access boundary, not just an unlisted
// URL.
export async function createDailyRoom({ name, expiresInSeconds = 60 * 60 * 3 }) {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  return dailyFetch("/rooms", {
    method: "POST",
    body: JSON.stringify({
      name,
      privacy: "private",
      properties: {
        enable_recording: false, // explicit — no recording for now
        exp,
        eject_at_room_exp: true,
        enable_screenshare: true,
        enable_chat: true,
        max_participants: 20,
      },
    }),
  });
}

export async function deleteDailyRoom(name) {
  return dailyFetch(`/rooms/${name}`, { method: "DELETE" });
}

export async function createMeetingToken({ roomName, userName, isOwner, expiresInSeconds = 60 * 60 * 3 }) {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const data = await dailyFetch("/meeting-tokens", {
    method: "POST",
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_name: userName,
        is_owner: isOwner,
        enable_recording: false,
        exp,
      },
    }),
  });
  return data.token;
}