// ======================
// REQUIREMENTS
// ======================
const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load DISCORD_TOKEN from .env
const fetch = require("node-fetch"); // npm install node-fetch@2
const { Client, GatewayIntentBits } = require("discord.js");

// ======================
// EXPRESS SETUP
// ======================
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Root route for keep-alive
app.get("/", (req, res) => {
    res.status(200).send("🚀 XZX Base Finder Online");
});

// POST endpoint to send logs to Discord
app.post("/log", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).send("No message provided");

        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
        await channel.send(message);

        res.status(200).send("Message sent to Discord ✅");
    } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).send("Failed to send message");
    }
});

// Start Express server
app.listen(PORT, () => {
    console.log(`🚀 API running on port ${PORT}`);
});

// ======================
// DISCORD BOT SETUP
// ======================
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const DISCORD_CHANNEL_ID = "1445405374462038217"; // Replace with your channel ID

client.once("ready", async () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);

    // Send startup message to channel
    try {
        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
        await channel.send("✅ XZX Base Finder is now online!");
    } catch (err) {
        console.error("❌ Could not send startup message:", err);
    }
});

// Log in to Discord
client.login(process.env.DISCORD_TOKEN);

// ======================
// SELF-PING / HEARTBEAT
// ======================

// Logs every 30s
setInterval(() => console.log("👾 Alive check"), 30_000);

// Ping self every 5 minutes to prevent container shutdown
setInterval(async () => {
    try {
        await fetch(`http://localhost:${PORT}/`);
        console.log("🟣 Self-ping success");
    } catch (err) {
        console.warn("⚠️ Self-ping failed:", err.message);
    }
}, 5 * 60 * 1000); // 5 minutes

// ======================
// HANDLE UNHANDLED ERRORS
// ======================
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});
