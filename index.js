const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.json());

// ✅ Read Discord token from environment
const TOKEN = process.env.DISCORD_TOKEN;

// Discord channels
const MEDIUM_CHANNEL = "1445405374462038217"; // Medium Base Finder
const HIGH_CHANNEL = "1466214480009625724";   // High Base Finder

// Initialize Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("clientReady", () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(TOKEN);

// POST endpoint for Roblox base finder
app.post("/finder", async (req, res) => {
    const { name, worth, players } = req.body;
    if (!name || !worth) return res.sendStatus(400);

    // Convert worth string to number
    const numericWorth = parseFloat(
        worth.replace(/[$,kMB]/gi, "")
    ) * (worth.includes("B") ? 1_000_000_000 : worth.includes("M") ? 1_000_000 : worth.includes("k") ? 1000 : 1);

    // Choose channel based on worth
    const channelId = numericWorth >= 200_000_000 ? HIGH_CHANNEL : MEDIUM_CHANNEL;

    const channel = await client.channels.fetch(channelId).catch(() => null);
    if (!channel) return res.status(400).send("Invalid channel");

    // Build embed
    const embed = new EmbedBuilder()
        .setTitle("| XZX HUB | BASE FINDER |")
        .setColor(0x2f3136) // Dark Discord-style
        .addFields(
            { name: "📛 Name", value: name, inline: true },
            { name: "💰 Worth", value: worth, inline: true },
            { name: "👥 Players", value: players || "N/A", inline: true },
            { name: "🆔 Job ID (Mobile)", value: "`" + crypto.randomUUID() + "`", inline: true },
            { name: "🆔 Job ID (PC)", value: "`" + crypto.randomUUID() + "`", inline: true },
            { name: "🌐 Join Link", value: "[Click to Join](https://roblox.com)", inline: true }
        )
        .setFooter({ text: `| PROVIDED BY XZX HUB | AT ${new Date().toLocaleString()}` });

    await channel.send({ embeds: [embed] });
    res.sendStatus(200);
});

// Start server
app.listen(process.env.PORT || 8080, () => {
    console.log("🚀 API running on port 8080");
});
