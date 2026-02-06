import express from "express";
importvbBbzbzhz { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// ===== EXPRESS KEEP ALIVE =====
const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("Server is running for keep-alive..."));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// ===== DISCORD CLIENT =====
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on("clientReady", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// ===== BASE FINDER FUNCTION =====
async function checkServers() {
  // Example API URLs (replace with your own)
  const highURL = "https://xzxbotv1-production.up.railway.app/finder/high";
  const mediumURL = "https://xzxbotv1-production.up.railway.app/finder/medium";

  try {
    const highRes = await fetch(highURL);
    const highData = await highRes.json();

    const mediumRes = await fetch(mediumURL);
    const mediumData = await mediumRes.json();

    // Format example: 0/8 users
    const highMessage = highData.map(
      (b) => `🏰 ${b.name} | Users: ${b.users}/8 | Job: ${b.job || "N/A"}`
    ).join("\n") || "No High Base found";

    const mediumMessage = mediumData.map(
      (b) => `🏰 ${b.name} | Users: ${b.users}/8 | Job: ${b.job || "N/A"}`
    ).join("\n") || "No Medium Base found";

    // Send to Discord
    const highChannel = await client.channels.fetch(process.env.HIGH_CHANNEL_ID);
    const mediumChannel = await client.channels.fetch(process.env.MEDIUM_CHANNEL_ID);

    if (highChannel) await highChannel.send(highMessage);
    if (mediumChannel) await mediumChannel.send(mediumMessage);

    console.log("✅ Server info sent to Discord");

  } catch (err) {
    console.error("❌ Error fetching/sending server info:", err);
  }
}

// ===== AUTO CHECK LOOP =====
setInterval(() => {
  console.log("🔁 Checking servers...");
  checkServers();
}, 30_000); // every 30 seconds

// ===== LOGIN DISCORD =====
client.login(process.env.DISCORD_TOKEN);
