const express = require("express");
const cors = require("cors");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const app = express();
app.use(cors());
app.use(express.json());

// ===== DISCORD BOT =====
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_NAME = "𝙈𝙀𝘿𝙄𝙐𝙈-𝘽𝘼𝙎𝙀-𝙁𝙄𝙉𝘿𝙀𝙍";

const discord = new Client({
  intents: [GatewayIntentBits.Guilds]
});

discord.login(DISCORD_TOKEN);

discord.once("ready", () => {
  console.log(`🤖 Logged in as ${discord.user.tag}`);
});

// Find channel by name
async function getChannel() {
  for (const guild of discord.guilds.cache.values()) {
    const channel = guild.channels.cache.find(
      c => c.name === CHANNEL_NAME
    );
    if (channel) return channel;
  }
  return null;
}

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.json({ status: "online" });
});

// MAIN FINDER ENDPOINT
app.post("/finder", async (req, res) => {
  const { name, worth, player } = req.body;

  if (!name || !worth) {
    return res.status(400).json({ error: "Missing data" });
  }

  const channel = await getChannel();
  if (!channel) {
    return res.status(500).json({ error: "Discord channel not found" });
  }

  const embed = new EmbedBuilder()
    .setTitle("🔎 Medium Base Found")
    .addFields(
      { name: "Object", value: name, inline: true },
      { name: "Worth", value: `$${Number(worth).toLocaleString()}`, inline: true },
      { name: "Found By", value: player || "Unknown", inline: false }
    )
    .setColor(0xffcc00)
    .setTimestamp();

  await channel.send({ embeds: [embed] });

  console.log(`📨 Sent to Discord: ${name}`);
  res.json({ success: true });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});
