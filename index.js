// ======================
// REQUIREMENTS
// ======================
const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load DISCORD_TOKEN from .env
const { Client, GatewayIntentBits } = require("discord.js");

// ======================
// EXPRESS SETUP
// ======================
const app = express();
app.use(cors());
app.use(express.json());

// Root route for keep-alive
app.get("/", (req, res) => {
    res.status(200).send("🚀 XZX Base Finder Online");
});

// Example POST endpoint to send messages to Discord
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
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 API running on port ${PORT}`);
});

// ======================
// DISCORD BOT SETUP
// ======================
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const DISCORD_CHANNEL_ID = "1445405374462038217"; // Your channel ID here

client.once("ready", async () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);

    // Optional: send startup message to channel
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
// HEARTBEAT LOG
// ======================
setInterval(() => {
    console.log("👾 Alive check");
}, 30000);

// ======================
// UNHANDLED PROMISE REJECTION
// ======================
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
});
