const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // node-fetch modülünü ekleyin
const app = express();

const PORT = 8000;

app.use(express.json());
app.use(cors());

const API_KEY = ''; // added your api key here

app.post('/completions', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "GPT-3.5",
            messages: [{ role: "user", content: req.body.message }],
            max_tokens: 100,
        }),
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
