const express = require("express");
const cors = require("cors");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

require("dotenv").config(); // Optional, only if you want to use .env

const app = express();
app.use(cors());
app.use(express.json());

/* ======================
   EXPRESS KEEP-ALIVE
====================== */
app.get("/", (req, res) => {
  res.status(200).send("XZX Base Finder API Online");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});

/* ======================
   DISCORD BOT
====================== */
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

/* ======================
   DISCORD CHANNEL IDs
====================== */
const ORIGINAL_CHANNEL_ID = "original_channel_here"; // replace with your original channel
const NEW_CHANNEL_ID = "1466214480009625724"; // new channel

/* ======================
   HANDLE POST REQUESTS
====================== */
app.post("/finder", async (req, res) => {
  try {
    const {
      name,
      worth,
      players,
      jobIdMobile,
      jobIdPC,
      joinLink,
      channelId
    } = req.body;

    // Determine which channel
    const targetChannelId =
      channelId === NEW_CHANNEL_ID ? NEW_CHANNEL_ID : ORIGINAL_CHANNEL_ID;

    const channel = await client.channels.fetch(targetChannelId);
    if (!channel) return res.status(404).send("Channel not found");

    // Build a clean Discord-style embed
    const embed = new EmbedBuilder()
      .setTitle("| XZX HUB | BASE FINDER |")
      .setColor(0x1f1f2f) // dark gradient feel
      .addFields(
        { name: "📛 Name", value: name, inline: true },
        { name: "💰 Worth", value: worth, inline: true },
        { name: "👥 Players", value: players, inline: true },
        { name: "🆔 Job ID (Mobile)", value: `\`${jobIdMobile}\``, inline: false },
        { name: "🆔 Job ID (PC)", value: `\`${jobIdPC}\``, inline: false },
        { name: "🌐 Join Link", value: `[Click to Join](${joinLink})`, inline: false }
      )
      .setFooter({ text: `| PROVIDED BY XZX HUB | AT ${new Date().toLocaleString()} |` });

    await channel.send({ embeds: [embed] });

    res.status(200).send("✅ Embed sent");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending embed");
  }
});
