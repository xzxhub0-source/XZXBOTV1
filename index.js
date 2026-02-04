const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

/* ================= CONFIG ================= */

const PORT = process.env.PORT || 8080;
const TOKEN = process.env.DISCORD_TOKEN;

const MEDIUM_CHANNEL = "1445405374462038217";
const HIGH_CHANNEL = "1466214480009625724";

/* ================= EXPRESS ================= */

const app = express();
app.use(express.json());

// Railway health check
app.get("/", (_, res) => {
    res.status(200).send("XZX HUB Base Finder ONLINE");
});

// IMPORTANT: bind to 0.0.0.0
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API running on port ${PORT}`);
});

/* ================= DISCORD ================= */

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("clientReady", () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(TOKEN);

/* ================= KEEP ALIVE ================= */
// This prevents Railway from killing the container
setInterval(() => {
    // noop – keeps event loop alive
}, 1000);

/* ================= HELPERS ================= */

function formatWorth(num) {
    if (typeof num !== "number") return "N/A";
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num}`;
}

/* ================= API ================= */

app.post("/report", async (req, res) => {
    try {
        const {
            name,
            worth,
            players,
            maxPlayers,
            jobIdMobile,
            jobIdPC,
            placeId
        } = req.body;

        if (!name || !jobIdPC) {
            return res.status(400).json({ error: "Invalid payload" });
        }

        const embed = {
            title: "| XZX HUB | BASE FINDER |",
            color: 0x0b1020,
            fields: [
                { name: "📛 Name", value: name },
                { name: "💰 Worth", value: formatWorth(worth), inline: true },
                { name: "👥 Players", value: `${players}/${maxPlayers}`, inline: true },
                { name: "🆔 Job ID (Mobile)", value: `\`\`\`${jobIdMobile}\`\`\`` },
                { name: "🆔 Job ID (PC)", value: `\`\`\`${jobIdPC}\`\`\`` },
                {
                    name: "🌐 Join Link",
                    value: `[Click to Join](https://www.roblox.com/games/${placeId}?jobId=${jobIdPC})`
                }
            ],
            footer: {
                text: `| PROVIDED BY XZX HUB | AT ${new Date().toLocaleString()} |`
            }
        };

        const channelId =
            worth >= 10_000_000 ? HIGH_CHANNEL : MEDIUM_CHANNEL;

        const channel = await client.channels.fetch(channelId);
        await channel.send({ embeds: [embed] });

        res.json({ success: true });
    } catch (err) {
        console.error("REPORT ERROR:", err);
        res.status(500).json({ error: "Internal error" });
    }
});
