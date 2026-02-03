const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage (use a database in production)
let storedData = {
    players: [],
    datastoreKeys: [],
    logs: []
};

// Authentication middleware (simple API key check)
const requireApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    const validKey = process.env.API_KEY || "default-secret-key";
    
    if (!apiKey || apiKey !== validKey) {
        return res.status(401).json({ 
            success: false, 
            error: "Invalid or missing API key" 
        });
    }
    next();
};

// ===== PUBLIC ENDPOINTS =====
app.get("/", (req, res) => {
    res.json({
        service: "XZX Base Finder Bridge",
        status: "Online",
        endpoints: {
            public: ["GET /", "POST /register", "GET /status"],
            protected: [
                "POST /datastore/add",
                "GET /datastore/list",
                "POST /player/join",
                "GET /players",
                "GET /logs"
            ]
        },
        usage: "Add header: x-api-key: your-secret-key"
    });
});

// Register new client
app.post("/register", (req, res) => {
    const { clientName, version } = req.body;
    const timestamp = new Date().toISOString();
    
    storedData.logs.push({
        type: "REGISTER",
        clientName,
        version,
        timestamp,
        ip: req.ip
    });
    
    console.log(`📝 New client registered: ${clientName} v${version}`);
    
    res.json({
        success: true,
        message: `Welcome ${clientName}!`,
        assignedId: Date.now().toString(36),
        timestamp
    });
});

// Status check
app.get("/status", (req, res) => {
    res.json({
        success: true,
        status: "operational",
        uptime: process.uptime(),
        storedData: {
            players: storedData.players.length,
            datastoreKeys: storedData.datastoreKeys.length,
            logs: storedData.logs.length
        }
    });
});

// ===== PROTECTED ENDPOINTS =====

// Add DataStore key found by exploit
app.post("/datastore/add", requireApiKey, (req, res) => {
    const { key, value, type, gameId } = req.body;
    
    if (!key) {
        return res.status(400).json({ 
            success: false, 
            error: "Missing 'key' field" 
        });
    }
    
    const newEntry = {
        key,
        value: value || "No value provided",
        type: type || "unknown",
        gameId: gameId || "unknown",
        timestamp: new Date().toISOString(),
        source: req.headers['x-client-id'] || "unknown"
    };
    
    storedData.datastoreKeys.push(newEntry);
    storedData.logs.push({
        type: "DATASTORE_ADD",
        key,
        timestamp: newEntry.timestamp
    });
    
    console.log(`🔑 New DataStore key: ${key}`);
    
    res.json({
        success: true,
        message: "Key stored successfully",
        entry: newEntry,
        totalKeys: storedData.datastoreKeys.length
    });
});

// List all DataStore keys
app.get("/datastore/list", requireApiKey, (req, res) => {
    const { type, limit } = req.query;
    
    let keys = storedData.datastoreKeys;
    
    // Filter by type if specified
    if (type) {
        keys = keys.filter(k => k.type === type);
    }
    
    // Limit results if specified
    if (limit) {
        keys = keys.slice(-parseInt(limit));
    }
    
    res.json({
        success: true,
        count: keys.length,
        total: storedData.datastoreKeys.length,
        keys: keys.reverse() // Newest first
    });
});

// Record player join
app.post("/player/join", requireApiKey, (req, res) => {
    const { userId, username, placeId, extraData } = req.body;
    
    if (!userId || !username) {
        return res.status(400).json({ 
            success: false, 
            error: "Missing userId or username" 
        });
    }
    
    const playerData = {
        userId,
        username,
        placeId: placeId || "unknown",
        extraData: extraData || {},
        joinTime: new Date().toISOString(),
        source: req.headers['x-client-id'] || "unknown",
        ip: req.ip
    };
    
    // Remove existing entry if same user joins again
    storedData.players = storedData.players.filter(p => p.userId !== userId);
    
    storedData.players.push(playerData);
    storedData.logs.push({
        type: "PLAYER_JOIN",
        userId,
        username,
        timestamp: playerData.joinTime
    });
    
    console.log(`👤 Player joined: ${username} (${userId})`);
    
    res.json({
        success: true,
        message: "Player data recorded",
        player: playerData,
        activePlayers: storedData.players.length
    });
});

// Get all active players
app.get("/players", requireApiKey, (req, res) => {
    // Filter out players who haven't been active in 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const activePlayers = storedData.players.filter(
        p => p.joinTime > fiveMinutesAgo
    );
    
    res.json({
        success: true,
        active: activePlayers.length,
        total: storedData.players.length,
        players: activePlayers
    });
});

// Get logs
app.get("/logs", requireApiKey, (req, res) => {
    const { limit = 50, type } = req.query;
    
    let logs = storedData.logs;
    
    if (type) {
        logs = logs.filter(log => log.type === type);
    }
    
    logs = logs.slice(-parseInt(limit)).reverse();
    
    res.json({
        success: true,
        count: logs.length,
        logs
    });
});

// Clear all data (optional, for testing)
app.delete("/clear", requireApiKey, (req, res) => {
    const count = {
        players: storedData.players.length,
        datastoreKeys: storedData.datastoreKeys.length,
        logs: storedData.logs.length
    };
    
    storedData = {
        players: [],
        datastoreKeys: [],
        logs: []
    };
    
    res.json({
        success: true,
        message: "All data cleared",
        cleared: count
    });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
🚀 XZX Base Finder API is running!
📡 Port: ${PORT}
🔐 API Key Required for protected endpoints
📝 Set API_KEY in environment or use 'default-secret-key'

📋 Endpoints:
   GET  /              - Service info
   POST /register      - Register new client
   GET  /status        - Service status
   
🔒 Protected (add header: x-api-key):
   POST /datastore/add - Add DataStore key
   GET  /datastore/list - List all keys
   POST /player/join   - Record player
   GET  /players       - Active players
   GET  /logs          - View logs
   DELETE /clear       - Clear data (testing)
    `);
});
