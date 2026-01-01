require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/stock', async (req, res) => {
    const symbol = req.query.symbol || 'AAPL'; // Default to Apple if no symbol provided
    const apiKey = "d5b3fs1r01qh7ajk85ngd5b3fs1r01qh7ajk85o0";

    // Check if user forgot to add API Key
    if (!apiKey || apiKey === 'd5b3bphr01qh7ajk7dn0d5b3bphr01qh7ajk7dng') {
        return res.json({ 
            success: false, 
            message: "API Key Missing! Check .env file." 
        });
    }

    try {
        // Fetch Quote from Finnhub
        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
        
        const data = response.data;

        // Finnhub returns { c: current price, d: change, dp: percent change ... }
        if (data.c === 0 && data.d === null) {
             throw new Error("Invalid Symbol");
        }

        res.json({
            success: true,
            symbol: symbol.toUpperCase(),
            price: data.c,           // Current Price
            change: data.d,          // Change in $
            percent: data.dp,        // Change in %
            updatedAt: new Date().toLocaleTimeString()
        });

    } catch (error) {
        console.error(error);
        res.json({ 
            success: false, 
            message: "Symbol not found or API Limit reached." 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
