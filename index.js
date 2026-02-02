import express from "express";
import { Client, GatewayIntentBits } from "discord.js";

const app = express();
app.use(express.json());

// ENV VARIABLES
const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.BASE_FINDER_CHANNEL_ID;
const PORT = process.env.PORT || 3000;

// DISCORD CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

// READY
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// HARD-LOCK SEND FUNCTION
async function sendToBaseFinder(embed) {
  const channel = await client.channels.fetch(CHANNEL_ID).catch(() => null);
  if (!channel) return;

  await channel.send({ embeds: [embed] });
}

// ROBLOX → RAILWAY ENDPOINT
app.post("/xzx", async (req, res) => {
  try {
    const { name, worth, players, jobId, joinLink, timestamp } = req.body;

    if (!name || !worth) {
      return res.status(400).json({ success: false });
    }

    const embed = {
      title: "| XZX HUB | BASE FINDER |",
      color: 16753920,
      fields: [
        { name: "📛 Name", value: name, inline: false },
        { name: "💰 Worth", value: worth, inline: false },
        { name: "👥 Players", value: players || "Unknown", inline: false },
        { name: "🆔 Job ID (Mobile)", value: jobId || "N/A", inline: false },
        { name: "🆔 Job ID (PC)", value: jobId || "N/A", inline: false },
        { name: "🌐 Join Link", value: joinLink || "N/A", inline: false }
      ],
      footer: {
        text: `| PROVIDED BY XZX HUB | ${timestamp || new Date().toLocaleString()} |`
      }
    };

    await sendToBaseFinder(embed);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Railway server running on port ${PORT}`);
});

// LOGIN BOT
client.login(TOKEN);
