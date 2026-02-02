import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// READ FROM RAILWAY VARIABLE
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

if (!DISCORD_WEBHOOK) {
  console.error("DISCORD_WEBHOOK variable is missing");
}

app.post("/xzx", async (req, res) => {
  try {
    const { name, worth, players, jobId, joinLink, timestamp } = req.body;

    const embed = {
      title: "| XZX HUB | BASE FINDER |",
      color: 16753920,
      fields: [
        { name: "📛 Name", value: name, inline: false },
        { name: "💰 Worth", value: worth, inline: false },
        { name: "👥 Players", value: players, inline: false },
        { name: "🆔 Job ID (Mobile)", value: jobId, inline: false },
        { name: "🆔 Job ID (PC)", value: jobId, inline: false },
        { name: "🌐 Join Link", value: `[Click to Join](${joinLink})`, inline: false }
      ],
      footer: {
        text: `| PROVIDED BY XZX HUB | ${timestamp} |`
      }
    };

    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "XZX HUB",
        embeds: [embed]
      })
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("XZX HUB Railway server running");
});
