const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const bodyParser = require("body-parser");

// --------- EXPRESS SETUP (Optional API for Lua) ---------
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;
app.get("/", (req, res) => res.send("API running"));
app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));

// --------- DISCORD BOT SETUP ---------
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Environment variables from Railway
const BOT_TOKEN = process.env.BOT_TOKEN;
const MEDIUM_CHANNEL_ID = process.env.MEDIUM_CHANNEL_ID;
const HIGH_CHANNEL_ID = process.env.HIGH_CHANNEL_ID;

// --------- DATA ---------
const mediumList = [
  { name: "Karkerkar Kurkur", price: "$100,000,000" },
  { name: "Los Tortus", price: "$100,000,000" },
  { name: "Los Matteos", price: "$100,000,000" },
  { name: "Sammyni Spyderini", price: "$100,000,000" },
  { name: "Trenostruzzo Turbo 4000", price: "$100,000,000" },
  { name: "Chimpanzini Spiderini", price: "$100,000,000" },
  { name: "Boatito Auratito", price: "$115,000,000" },
  { name: "Fragola La La La", price: "$125,000,000" },
  { name: "Dul Dul Dul", price: "$150,000,000" },
  { name: "La Vacca Prese Presente", price: "$160,000,000" },
  { name: "Frankentteo", price: "$175,000,000" },
  { name: "Los Trios", price: "$175,000,000" },
  { name: "Karker Sahur", price: "$185,000,000" },
  { name: "Torrtuginni Dragonfrutini", price: "$500,000,000" },
  { name: "Los Tralaleritos", price: "$100,000,000" },
  { name: "Zombie Tralala", price: "$100,000,000" },
  { name: "La Cucaracha", price: "$110,000,000" },
  { name: "Vulturino Skeletono", price: "$110,000,000" },
  { name: "Guerriro Digitale", price: "$120,000,000" },
  { name: "Extinct Tralalero", price: "$125,000,000" },
  { name: "Yess My Examine", price: "$130,000,000" },
  { name: "Extinct Matteo", price: "$140,000,000" },
  { name: "Las Tralaleritas", price: "$150,000,000" }
];

const highList = [
  { name: "Reindeer Tralala", price: "$160,000,000" },
  { name: "Las Vaquitas Saturnitas", price: "-" },
  { name: "Pumpkin Spyderini", price: "$165,000,000" },
  { name: "Job Job Job Sahur", price: "$175,000,000" },
  { name: "Los Karkeritos", price: "$200,000,000" },
  { name: "Graipuss Medussi", price: "$200,000,000" },
  { name: "Santteo", price: "$210,000,000" },
  { name: "La Vacca Jacko Linterino", price: "$225,000,000" },
  { name: "Triplito Tralaleritos", price: "$230,000,000" },
  { name: "Trickolino", price: "$235,000,000" },
  { name: "Giftini Spyderini", price: "$240,000,000" },
  { name: "Los Spyderinis", price: "$250,000,000" },
  { name: "Perrito Burrito", price: "$250,000,000" },
  { name: "1x1x1x1", price: "$255,500,000" },
  { name: "Los Cucarachas", price: "$300,000,000" },
  { name: "Please My Present", price: "$350,000,000" },
  { name: "Cuadramat and Pakrahmatmamat", price: "$400,000,000" },
  { name: "Los Jobcitos", price: "$500,000,000" },
  { name: "Nooo My Hotspot", price: "$500,000,000" },
  { name: "Pot Hotspot (Lucky Block)", price: "$500,000,000" },
  { name: "Noo My Examine", price: "$525,000,000" },
  { name: "Telemorte", price: "$550,000,000" },
  { name: "La Sahur Combinasion", price: "$550,000,000" },
  { name: "List List List Sahur", price: "$550,000,000" },
  { name: "To To To Sahur", price: "$575,000,000" },
  { name: "Pirulitoita Bicicletaire", price: "$600,000,000" },
  { name: "25", price: "$600,000,000" },
  { name: "Santa Hotspot", price: "$625,000,000" },
  { name: "Horegini Boom", price: "$650,000,000" },
  { name: "Quesadilla Crocodila", price: "$700,000,000" },
  { name: "Pot Pumpkin", price: "$700,000,000" },
  { name: "Naughty Naughty", price: "$700,000,000" },
  { name: "Ho Ho Ho Sahur", price: "$725,000,000" },
  { name: "Mi Gatito", price: "$725,000,000" }
];

// --------- FUNCTION TO SEND LISTS ---------
async function sendList(channelId, list) {
  const channel = await client.channels.fetch(channelId);
  if (!channel) return console.log(`❌ Channel not found: ${channelId}`);

  let message = "";
  list.forEach(item => {
    message += `• ${item.name} — ${item.price}\n`;
  });

  const chunkSize = 2000;
  for (let i = 0; i < message.length; i += chunkSize) {
    await channel.send(message.slice(i, i + chunkSize));
  }
}

// --------- BOT EVENTS ---------
client.once("clientReady", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  sendList(MEDIUM_CHANNEL_ID, mediumList);
  sendList(HIGH_CHANNEL_ID, highList);
});

// Login
client.login(BOT_TOKEN);
