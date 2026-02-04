const express = require("express");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const app = express();
app.use(express.json());

// Your channel IDs (fixed)
const MEDIUM_CHANNEL = "1445405374462038217";
const HIGH_CHANNEL = "1466214480009625724";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Rails app health check
app.get("/", (req, res) => res.send("XZX Base Finder is running"));

// Start Express
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));

// Login bot using token from Railway ENV
client.login(process.env.BOT_TOKEN);

client.once("clientReady", () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);
});

// Format worth numbers
function formatWorth(num) {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(0)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(0)}K`;
  return `$${num}`;
}

// API for receiving Lua payload
app.post("/report", async (req, res) => {
  try {
    const { name, worth, tier, players, maxPlayers, jobId, placeId } = req.body;

    if (!name || !worth || !tier) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // Choose channel based on tier
    const channelId = tier === "HIGH" ? HIGH_CHANNEL : MEDIUM_CHANNEL;

    // Fetch channel
    const channel = await client.channels.fetch(channelId).catch(() => null);
    if (!channel) {
      console.error("❌ Channel fetch failed:", channelId);
      return res.status(404).json({ error: "Channel not found" });
    }

    // Create embed
    const embed = new EmbedBuilder()
      .setTitle("| XZX HUB | BASE FINDER |")
      .setColor(tier === "HIGH" ? 0xff3b3b : 0x00b0f4)
      .addFields(
        { name: "📛 Name", value: name, inline: false },
        { name: "💰 Worth", value: formatWorth(worth), inline: true },
        { name: "👥 Players", value: `${players}/${maxPlayers}`, inline: true },
        {
          name: "🆔 Job ID",
          value: `\`\`\`${jobId}\`\`\``,
          inline: false,
        },
        {
          name: "🌐 Join Link",
          value: `[Click to Join](https://www.roblox.com/games/${placeId}?jobId=${jobId})`,
          inline: false,
        }
      )
      .setFooter({
        text: `PROVIDED BY XZX HUB | AT ${new Date().toLocaleTimeString()}`,
      });

    await channel.send({ embeds: [embed] });
    return res.json({ success: true });
  } catch (err) {
    console.error("REPORT ERROR:", err);
    return res.status(500).json({ error: "Internal error" });
  }
});

// Prevent container from idling
setInterval(() => {
  console.log("❤️ Keep alive");
}, 30000);
