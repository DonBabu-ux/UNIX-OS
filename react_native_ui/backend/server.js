const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const GROK_API_KEY = process.env.VITE_XAI_API_KEY;
const NEON_API_KEY = process.env.NEON_API_KEY;
const NEON_REST_URL = process.env.NEON_REST_URL; // SQL REST endpoint

// --- NEON REST API HELPER ---
async function neonQuery(sql, params = []) {
    // Basic parametric SQL simulation for REST (Neon usually expects raw SQL or specific API formats)
    // Note: This implementation assumes Neon REST SQL endpoint behavior
    const response = await fetch(`${NEON_REST_URL}/sql`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NEON_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sql, params })
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Neon API Error: ${err}`);
    }
    return await response.json();
}

// --- AI PROXY ---
app.post('/api/ai/chat', async (req, res) => {
    try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROK_API_KEY}`
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'AI Proxy Error', message: error.message });
    }
});

// --- TASKS CRUD (Neon REST) ---
app.get('/api/tasks', async (req, res) => {
    const { userId } = req.query;
    try {
        const sql = userId 
            ? `SELECT * FROM tasks WHERE user_id = '${userId}' ORDER BY created_at DESC`
            : `SELECT * FROM tasks WHERE user_id IS NULL ORDER BY created_at DESC`;
        const result = await neonQuery(sql);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'DB Error', message: error.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    const { user_id, title, description, priority, category } = req.body;
    try {
        const sql = `INSERT INTO tasks (user_id, title, description, priority, category) 
                     VALUES (${user_id ? `'${user_id}'` : 'NULL'}, '${title}', '${description}', '${priority}', '${category}') 
                     RETURNING *`;
        const result = await neonQuery(sql);
        res.json(result?.[0] || result);
    } catch (error) {
        res.status(500).json({ error: 'DB Error', message: error.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await neonQuery(`DELETE FROM tasks WHERE id = '${req.params.id}'`);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'DB Error', message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Univa Backend (REST Mode) running at http://localhost:${PORT}`);
});
