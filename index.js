const axios = require("axios");

// ================= CONFIG =================
const RAILWAY_URL = "https://xzxbotv1-production.up.railway.app/xzx"; // Your endpoint
const POLL_INTERVAL = 10000; // 10 seconds
const UNIVERSE_ID = "12399211456"; // Universe ID for your game
const DATASTORE = "RailwayQueue";
// =========================================

// API Key stored as environment variable
const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;

if (!ROBLOX_API_KEY) {
  console.error("🚨 ROBLOX_API_KEY not set in environment variables!");
  process.exit(1);
}

const HEADERS = {
  "x-api-key": ROBLOX_API_KEY
};

// LIST KEYS
async function listKeys() {
  const res = await axios.get(
    `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/keys?datastoreName=${DATASTORE}`,
    { headers: HEADERS }
  );
  return res.data.keys || [];
}

// GET VALUE
async function getEntry(key) {
  const res = await axios.get(
    `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`,
    {
      headers: HEADERS,
      params: { datastoreName: DATASTORE, entryKey: key }
    }
  );
  return res.data;
}

// DELETE ENTRY
async function deleteEntry(key) {
  await axios.delete(
    `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`,
    {
      headers: HEADERS,
      params: { datastoreName: DATASTORE, entryKey: key }
    }
  );
}

// POLL LOOP
async function poll() {
  try {
    const keys = await listKeys();
    for (const key of keys) {
      const payload = await getEntry(key);

      await axios.post(RAILWAY_URL, payload, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("✅ Sent:", payload.name);
      await deleteEntry(key);
    }
  } catch (e) {
    console.error("Poll error:", e.response?.data || e.message);
  }
}

setInterval(poll, POLL_INTERVAL);
console.log("🚀 Roblox → Railway bridge online. Polling every 10s...");
