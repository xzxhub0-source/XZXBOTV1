import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const HIGH_CHANNEL_ID = process.env.HIGH_CHANNEL_ID;
const MEDIUM_CHANNEL_ID = process.env.MEDIUM_CHANNEL_ID;

// Express Keep-Alive Server
const app = express();
app.get("/", (req, res) => res.send("❤️ Keep alive"));
app.listen(process.env.PORT || 8080, () => console.log("Server is running for keep-alive..."));

// Mock function to get bases (replace with your real logic)
async function getBases(type) {
    // Example response
    return [
        { name: type === "high" ? "La Vacca Saturno Saturnita" : "Pumpkin Spyderini", users: Math.floor(Math.random() * 8), jobId: Math.random() > 0.5 ? "PC" : "Mobile" }
    ];
}

// Send list to Discord
async function sendList(type) {
    const channelId = type === "high" ? HIGH_CHANNEL_ID : MEDIUM_CHANNEL_ID;
    const channel = await client.channels.fetch(channelId).catch(() => null);
    if (!channel) return console.log(`❌ Channel ${channelId} not found`);

    const bases = await getBases(type);

    for (const base of bases) {
        const embed = new EmbedBuilder()
            .setTitle(`${base.name}`)
            .setDescription(`Users: ${base.users}/8\nDevice: ${base.jobId}`)
            .setColor(type === "high" ? 0xff0000 : 0xffa500)
            .setTimestamp();

        channel.send({ embeds: [embed] }).catch(console.error);
    }
}

// Auto send every 30s
setInterval(() => {
    sendList("high");
    sendList("medium");
}, 30000);

// Discord Bot Login
client.on("ready", () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
