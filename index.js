// ======================
// REQUIREMENTS
// ======================
const express = require("express");
const cors = require("cors");
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

// ======================
// DISCORD BOT SETUP
// ======================
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Replace with your Discord channel ID
const DISCORD_CHANNEL_ID = "1445405374462038217";

client.once("ready", async () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);

    try {
        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
        if (channel) await channel.send("✅ XZX Base Finder is now online!");
    } catch (err) {
        console.error("❌ Could not send startup message:", err);
    }
});

// Log in using environment variable (safe)
if (!process.env.DISCORD_TOKEN) {
    console.error("❌ DISCORD_TOKEN not set in environment variables!");
    process.exit(1);
}
client.login(process.env.DISCORD_TOKEN);

// ======================
// POST ENDPOINT: /finder
// ======================
app.post("/finder", async (req, res) => {
    try {
        const { name, worth, player } = req.body;

        if (!name || !worth) return res.status(400).send("Missing data");

        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
        if (channel) {
            await channel.send(`🟡 **Base Found!**
**Name:** ${name}
**Worth:** ${worth}
**Player:** ${player}`);
        }

        res.status(200).send("Data sent to Discord ✅");
    } catch (err) {
        console.error("Error sending to Discord:", err);
        res.status(500).send("Failed to send data to Discord ❌");
    }
});

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 API running on port ${PORT}`);
});

// ======================
// HEARTBEAT LOG
// ======================
setInterval(() => {
    console.log("💓 Alive check");
}, 30000);

// ======================
// UNHANDLED PROMISE REJECTION
// ======================
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
});
