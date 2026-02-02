const axios = require("axios");

// ==== CONFIG ====
const RAILWAY_URL = process.env.RAILWAY_URL || "YOUR_RAILWAY_ENDPOINT";
const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY || "YOUR_API_KEY";
const UNIVERSE_ID = "109983668079237"; // Replace with your Roblox game ID

// ==== HELPERS ====
async function fetchDataStoreKeys() {
    try {
        const res = await axios.get(
            `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/ExternalBridgeQueue/entries`,
            {
                headers: { "x-api-key": ROBLOX_API_KEY }
            }
        );
        return res.data.entries || [];
    } catch (err) {
        console.error("Error fetching DataStore keys:", err.message);
        return [];
    }
}

async function fetchDataStoreEntry(key) {
    try {
        const res = await axios.get(
            `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/ExternalBridgeQueue/entries/${key}`,
            {
                headers: { "x-api-key": ROBLOX_API_KEY }
            }
        );
        return res.data;
    } catch (err) {
        console.error(`Error fetching DataStore entry ${key}:`, err.message);
        return null;
    }
}

async function deleteDataStoreEntry(key) {
    try {
        await axios.delete(
            `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/ExternalBridgeQueue/entries/${key}`,
            {
                headers: { "x-api-key": ROBLOX_API_KEY }
            }
        );
    } catch (err) {
        console.error(`Error deleting DataStore entry ${key}:`, err.message);
    }
}

async function sendToRailway(data) {
    try {
        await axios.post(RAILWAY_URL, data);
        console.log("Sent to Railway:", data);
    } catch (err) {
        console.error("Error sending to Railway:", err.message);
    }
}

// ==== MAIN LOOP ====
async function poll() {
    const keys = await fetchDataStoreKeys();

    for (const keyObj of keys) {
        const key = keyObj.key;
        const entry = await fetchDataStoreEntry(key);
        if (!entry) continue;

        // Send to Railway
        await sendToRailway(entry);

        // Delete processed entry
        await deleteDataStoreEntry(key);
    }

    setTimeout(poll, 5000); // poll every 5 seconds
}

// ==== START ====
console.log("Starting XZX Base Finder bridge...");
poll();
