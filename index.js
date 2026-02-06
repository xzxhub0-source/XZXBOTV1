const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");
const bases = require("./bases.json");

// Environment variables from Railway
const WEBHOOK_MEDIUM = process.env.WEBHOOK_MEDIUM;
const WEBHOOK_HIGH = process.env.WEBHOOK_HIGH;
const WEBHOOK_ULTIMATE = process.env.WEBHOOK_ULTIMATE;

function sendEmbed(base, tier) {
    let webhookUrl;
    if(tier === "medium") webhookUrl = WEBHOOK_MEDIUM;
    if(tier === "high") webhookUrl = WEBHOOK_HIGH;
    if(tier === "ultimate") webhookUrl = WEBHOOK_ULTIMATE;

    const now = new Date();
    const timestamp = now.toISOString();

    const embed = {
        username: "XZX HUB | Base Finder",
        avatar_url: "https://i.imgur.com/AfFp7pu.png",
        embeds: [{
            title: "| XZX HUB | BASE FINDER |",
            color: 0x1F1F1F,
            fields: [
                { name: "📛 Name", value: base.name, inline: true },
                { name: "💰 Worth", value: base.worth || "N/A", inline: true },
                { name: "👥 Players", value: "0/0", inline: true },
                { name: "🆔 Job ID (Mobile)", value: "``" + uuidv4() + "``", inline: true },
                { name: "🆔 Job ID (PC)", value: "``" + uuidv4() + "``", inline: true },
                { name: "🌐 Join Link", value: "[Click to Join](https://www.roblox.com/games/1234567890)", inline: true }
            ],
            footer: {
                text: `| PROVIDED BY XZX HUB | AT ${timestamp} |`
            }
        }]
    };

    fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embed)
    })
    .then(res => console.log(`Sent ${tier} base: ${base.name}`))
    .catch(err => console.error(err));
}

// Example: send all bases (for testing)
["medium","high","ultimate"].forEach(tier => {
    bases[tier].forEach(base => sendEmbed(base, tier));
});
