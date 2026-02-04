const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(express.json());

/* ================= CONFIG ================= */

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const MEDIUM_BASE_CHANNEL_ID = "1445405374462038217";
const HIGH_BASE_CHANNEL_ID = "1466214480009625724";

/* ============== DISCORD CLIENT ============== */

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(DISCORD_TOKEN);

/* ============== HELPERS ============== */

function formatWorth(num) {
    if (typeof num !== "number") return "N/A";
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
    return `$${num}`;
}

/* ============== API ROUTE ============== */

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

        if (!name || !jobIdMobile) {
            return res.status(400).json({ error: "Invalid payload" });
        }

        const playersText = `${players}/${maxPlayers}`;
        const joinLink = `https://www.roblox.com/games/${placeId}?jobId=${jobIdPC}`;

        const embed = {
            title: "| XZX HUB | BASE FINDER |",
            color: 0x0b1020,
            fields: [
                {
                    name: "📛 Name",
                    value: name,
                    inline: false
                },
                {
                    name: "💰 Worth",
                    value: formatWorth(worth),
                    inline: true
                },
                {
                    name: "👥 Players",
                    value: playersText,
                    inline: true
                },
                {
                    name: "🆔 Job ID (Mobile)",
                    value: `\`\`\`${jobIdMobile}\`\`\``,
                    inline: false
                },
                {
                    name: "🆔 Job ID (PC)",
                    value: `\`\`\`${jobIdPC}\`\`\``,
                    inline: false
                },
                {
                    name: "🌐 Join Link",
                    value: `[Click to Join](${joinLink})`,
                    inline: false
                }
            ],
            footer: {
                text: `| PROVIDED BY XZX HUB | AT ${new Date().toLocaleString()} |`
            }
        };

        const channelId =
            worth >= 10_000_000
                ? HIGH_BASE_CHANNEL_ID
                : MEDIUM_BASE_CHANNEL_ID;

        const channel = await client.channels.fetch(channelId);
        if (channel) {
            await channel.send({ embeds: [embed] });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

/* ============== START SERVER ============== */

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 API running on port ${PORT}`);
});
