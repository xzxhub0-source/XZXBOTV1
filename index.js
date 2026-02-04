const express = require("express");
const cors = require("cors");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(cors());
app.use(express.json());

/* ======================
   EXPRESS KEEP-ALIVE
====================== */
app.get("/", (req, res) => {
    res.status(200).send("XZX Base Finder Online");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 API running on port ${PORT}`);
});

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
   OPTIONAL: heartbeat log
====================== */
setInterval(() => {
    console.log("💓 Alive check");
}, 30000);
