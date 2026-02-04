const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(express.json());

/* ================= ENV ================= */

const TOKEN = process.env.DISCORD_TOKEN;
const PORT = process.env.PORT || 8080;

const MEDIUM_CHANNEL = "1445405374462038217";
const HIGH_CHANNEL = "1466214480009625724";

/* ================= EXPRESS ================= */

// REQUIRED so Railway doesn't kill the container
app.get("/", (req, res) => {
    res.status(200).send("XZX HUB Base Finder is running.");
});

/* ================= DISCORD ================= */

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("clientReady", () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(TOKEN);

/* ================= HELPERS ================= */

function formatWorth(value) {
    if (typeof value !== "number") return "N/A";
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value}`;
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
            return res.status(400).json({ error: "Bad payload" });
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
        console.error(err);
        res.status(500).json({ error: "Internal error" });
    }
});

/* ================= START ================= */

app.listen(PORT, () => {
    console.log(`🚀 API running on port ${PORT}`);
});
