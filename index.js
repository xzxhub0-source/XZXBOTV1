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

app.get("/", (req, res) => {
    res.status(200).send("🚀 XZX Base Finder Online");
});

// ======================
// DISCORD BOT SETUP
// ======================
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const DISCORD_CHANNEL_ID = "1445405374462038217"; // Change to your channel

client.once("ready", async () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

if (!process.env.DISCORD_TOKEN) {
    console.error("❌ DISCORD_TOKEN environment variable not set!");
    process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);

// ======================
// POST ENDPOINT: /finder
// ======================
app.post("/finder", async (req, res) => {
    try {
        const {
            name = "Unknown",
            worth = "N/A",
            players = "0/0",
            jobIdMobile = "0000-0000-0000-0000",
            jobIdPC = "0000-0000-0000-0000",
            joinLink = "https://www.roblox.com"
        } = req.body;

        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
        if (!channel) return res.status(404).send("Discord channel not found");

        // Create embed
        const embed = {
            title: "| XZX HUB | BASE FINDER |",
            color: 0x2F3136,
            description: "Detailed information about the detected base.",
            fields: [
                { name: "📛 Name", value: name, inline: true },
                { name: "💰 Worth", value: worth.toString(), inline: true },
                { name: "👥 Players", value: players, inline: true },
                { name: "🆔 Job ID (Mobile)", value: `\`\`\`\n${jobIdMobile}\n\`\`\``, inline: false },
                { name: "🆔 Job ID (PC)", value: `\`\`\`\n${jobIdPC}\n\`\`\``, inline: false },
                { name: "🌐 Join Link", value: `[Click to Join](${joinLink})`, inline: false }
            ],
            footer: { text: `| PROVIDED BY XZX HUB | AT ${new Date().toLocaleString()}` },
            timestamp: new Date().toISOString()
        };

        await channel.send({ embeds: [embed] });
        res.status(200).send("✅ Embed sent to Discord");
    } catch (err) {
        console.error("Error sending embed:", err);
        res.status(500).send("❌ Failed to send embed");
    }
});

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));

// ======================
// HEARTBEAT
// ======================
setInterval(() => console.log("💓 Alive check"), 30000);
