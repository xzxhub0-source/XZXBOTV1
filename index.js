const fetch = require('node-fetch');

// Your Discord webhook URL
const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://canary.discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN";

async function sendWebhook(message) {
    try {
        const res = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: message })
        });
        console.log("Webhook sent!", res.status);
    } catch (err) {
        console.error("Error sending webhook:", err);
    }
}

// Example usage
sendWebhook("✅ Bot started successfully!");
