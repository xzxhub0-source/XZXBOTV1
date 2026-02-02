const axios = require("axios");

// ===== CONFIG =====
const UNIVERSE_ID = "7709344486"; // Your Universe ID
const DATASTORE_NAME = "ExternalBridgeQueue"; // Roblox DataStore name
const API_KEY = process.env.API_KEY; // Your Roblox API key from Railway env variable

if (!API_KEY) {
    console.error("Error: API_KEY environment variable is not set!");
    process.exit(1);
}

// ===== FUNCTION TO FETCH KEYS =====
async function fetchDataStoreKeys() {
    try {
        const url = `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/${DATASTORE_NAME}/entries`;
        const response = await axios.get(url, {
            headers: { "x-api-key": API_KEY }
        });

        console.log("✅ DataStore keys fetched:", response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                console.error("❌ DataStore not found! Check Universe ID and DataStore name.");
            } else if (error.response.status === 403) {
                console.error("❌ Forbidden! Check your API key permissions.");
            } else {
                console.error("⚠️ Error fetching DataStore keys:", error.response.status, error.response.data);
            }
        } else {
            console.error("⚠️ Network or other error:", error.message);
        }
    }
}

// ===== AUTO-POLL EVERY 5 SECONDS =====
setInterval(fetchDataStoreKeys, 5000);

// Run immediately on start
fetchDataStoreKeys();
