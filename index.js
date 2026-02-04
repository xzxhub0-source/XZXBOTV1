require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('clientReady', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// Endpoint to receive Lua posts
app.post('/send', async (req, res) => {
  try {
    const { channel, name, price } = req.body;
    let channelId;

    if(channel === "medium") {
      channelId = process.env.MEDIUM_CHANNEL_ID;
    } else if(channel === "high") {
      channelId = process.env.HIGH_CHANNEL_ID;
    } else {
      return res.status(400).send({ error: "Invalid channel type" });
    }

    const discordChannel = await client.channels.fetch(channelId);
    await discordChannel.send(`**${name}** — $${Number(price).toLocaleString()}`);
    res.send({ success: true });
  } catch(err) {
    console.error(err);
    res.status(500).send({ error: "Failed to send message" });
  }
});

client.login(process.env.BOT_TOKEN);

app.listen(port, () => console.log(`🚀 API running on port ${port}`));
