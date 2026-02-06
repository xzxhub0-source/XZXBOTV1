import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

// Base lists
const MEDIUM_BASES = {
  "Karkerkar Kurkur": 100000000,
  "Los Tortus": 100000000,
  "Los Matteos": 100000000,
  "Sammyni Spyderini": 100000000,
  "Trenostruzzo Turbo 4000": 100000000,
  "Chimpanzini Spiderini": 100000000,
  "Boatito Auratito": 115000000,
  "Fragola La La La": 125000000,
  "Dul Dul Dul": 150000000,
  "La Vacca Prese Presente": 160000000,
  "Frankentteo": 175000000,
  "Los Trios": 175000000,
  "Karker Sahur": 185000000,
  "Torrtuginni Dragonfrutini": 500000000,
  "Los Tralaleritos": 100000000,
  "Zombie Tralala": 100000000,
  "La Cucaracha": 110000000,
  "Vulturino Skeletono": 110000000,
  "Guerriro Digitale": 120000000,
  "Extinct Tralalero": 125000000,
  "Yess My Examine": 130000000,
  "Extinct Matteo": 140000000,
  "Las Tralaleritas": 150000000
};

const HIGH_BASES = {
  "Reindeer Tralala": 160000000,
  "Las Vaquitas Saturnitas": 160000000,
  "Pumpkin Spyderini": 165000000,
  "Job Job Job Sahur": 175000000,
  "Los Karkeritos": 200000000,
  "Graipuss Medussi": 200000000,
  "Santteo": 210000000,
  "La Vacca Jacko Linterino": 225000000,
  "Triplito Tralaleritos": 230000000,
  "Trickolino": 235000000,
  "Giftini Spyderini": 240000000,
  "Los Spyderinis": 250000000,
  "Perrito Burrito": 250000000,
  "1x1x1x1": 255500000,
  "Los Cucarachas": 300000000,
  "Please My Present": 350000000,
  "Cuadramat and Pakrahmatmamat": 400000000,
  "Los Jobcitos": 500000000,
  "Nooo My Hotspot": 500000000,
  "Pot Hotspot (Lucky Block)": 500000000,
  "Noo My Examine": 525000000,
  "Telemorte": 550000000,
  "La Sahur Combinasion": 550000000,
  "List List List Sahur": 550000000,
  "To To To Sahur": 575000000,
  "Pirulitoita Bicicletaire": 600000000,
  "25": 600000000,
  "Santa Hotspot": 625000000,
  "Horegini Boom": 650000000,
  "Quesadilla Crocodila": 700000000,
  "Pot Pumpkin": 700000000,
  "Naughty Naughty": 700000000,
  "Ho Ho Ho Sahur": 725000000,
  "Mi Gatito": 725000000
};

// Webhooks
const HIGH_WEBHOOK = "https://discord.com/api/webhooks/1418752064443514980/1466214480009625724";
const MEDIUM_WEBHOOK = "https://discord.com/api/webhooks/1418752064443514980/1445405374462038217";

// API endpoint
app.post("/finder", async (req, res) => {
  try {
    const { baseName, players, jobType } = req.body;

    let tier = HIGH_BASES[baseName] ? "High" : MEDIUM_BASES[baseName] ? "Medium" : null;
    if (!tier) return res.status(400).send("Base not found");

    let value = tier === "High" ? HIGH_BASES[baseName] : MEDIUM_BASES[baseName];
    let webhook = tier === "High" ? HIGH_WEBHOOK : MEDIUM_WEBHOOK;

    // Send message to Discord
    const data = {
      content: `**${baseName} Base Found!**\nValue: $${value}\nPlayers: ${players}/8\nType: ${jobType}`
    };

    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    res.send("Base sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending base");
  }
});

app.listen(8080, () => {
  console.log("🚀 API running on port 8080");
});
