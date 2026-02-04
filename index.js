const express = require("express");
const cors = require("cors");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const app = express();
app.use(cors());
app.use(express.json());

/* ======================
   DISCORD BOT
====================== */

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

/* ======================
   CHANNEL IDS
====================== */

const CHANNELS = {
    medium: "1445405374462038217", // MEDIUM-BASE-FINDER
    high: "1466214480009625724"    // HIGH-BASE-FINDER
};

/* ======================
   UTILS
====================== */

function formatWorth(num) {
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}k`;
    return `$${num}`;
}

/* ======================
   API ENDPOINT
====================== */

app.post("/finder", async (req, res) => {
    try {
        const {
            name,
            worth,
            players,
            maxPlayers,
            jobId,
            placeId,
            channel
        } = req.body;

        if (!CHANNELS[channel]) {
            return res.status(400).json({ error: "Invalid channel type" });
        }

        const discordChannel = await client.channels.fetch(CHANNELS[channel]);

        const embed = new EmbedBuilder()
            .setColor(0x0f172a)
            .setTitle("| XZX HUB | BASE FINDER |")
            .addFields(
                { name: "📛 Name", value: name || "Unknown", inline: false },
                { name: "💰 Worth", value: formatWorth(worth), inline: true },
                { name: "👥 Players", value: `${players}/${maxPlayers}`, inline: true },
                { name: "🆔 Job ID (PC)", value: `\`\`\`${jobId}\`\`\``, inline: false },
                { name: "🌐 Join Link", value: `[Click to Join](https://www.roblox.com/games/start?placeId=${placeId}&jobId=${jobId})`, inline: false }
            )
            .setFooter({
                text: `| PROVIDED BY XZX HUB | AT ${new Date().toLocaleTimeString()} |`
            });

        await discordChannel.send({ embeds: [embed] });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal error" });
    }
});

/* ======================
   KEEP ALIVE
====================== */

app.get("/", (req, res) => {
    res.send("XZX Base Finder Online");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 API running on port ${PORT}`);
});
