const express = require("express");
const cors = require("cors");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const TOKEN = process.env.DISCORD_TOKEN;

// CHANNELS
const MEDIUM_CHANNEL = "1445405374462038217";
const HIGH_CHANNEL = "1466214480009625724";

// DISCORD CLIENT
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("clientReady", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(TOKEN);

// FORMAT MONEY
function formatWorth(num) {
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(0)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num}`;
}

// API ENDPOINT
app.post("/report", async (req, res) => {
  try {
    const {
      name,
      worth,
      tier,
      players,
      maxPlayers,
      jobId,
      placeId
    } = req.body;

    if (!tier || !name || !worth) {
      return res.status(400).send("Invalid payload");
    }

    const channelId =
      tier === "HIGH" ? HIGH_CHANNEL : MEDIUM_CHANNEL;

    const channel = await client.channels.fetch(channelId);
    if (!channel) return res.status(404).send("Channel not found");

    const embed = new EmbedBuilder()
      .setTitle("| XZX HUB | BASE FINDER |")
      .setColor(tier === "HIGH" ? 0xff3b3b : 0xffc107)
      .addFields(
        { name: "📛 Name", value: name, inline: false },
        { name: "💰 Worth", value: formatWorth(worth), inline: true },
        { name: "👥 Players", value: `${players}/${maxPlayers}`, inline: true },
        {
          name: "🆔 Job ID",
          value: `\`\`\`${jobId}\`\`\``,
          inline: false
        },
        {
          name: "🌐 Join Link",
          value: `[Click to Join](https://www.roblox.com/games/${placeId}?jobId=${jobId})`,
          inline: false
        }
      )
      .setFooter({
        text: `PROVIDED BY XZX HUB | ${new Date().toLocaleString()}`
      });

    await channel.send({ embeds: [embed] });

    res.send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});
