app.post("/xzx", async (req, res) => {
  console.log("📥 Incoming request from Roblox");
  console.log(req.body);

  try {
    const { name, worth } = req.body;

    if (!name || !worth) {
      console.log("❌ Missing data");
      return res.status(400).json({ success: false });
    }

    const embed = {
      title: "| XZX HUB | BASE FINDER |",
      color: 16753920,
      description: `**${name}**\nWorth: ${worth}`
    };

    const channel = await client.channels.fetch(CHANNEL_ID);
    await channel.send({ embeds: [embed] });

    console.log("✅ Sent message to Discord");
    res.json({ success: true });
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ success: false });
  }
});
