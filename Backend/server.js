const express = require('express'); 
const axios = require('axios'); 
const cors = require('cors'); 
const connection = require('./database/connection'); // your MySQL config

const app = express(); 
app.use(cors()); 
app.use(express.json()); 
app.use(express.static('public'));

const API_KEY = '0E22NJTKXA82AHBE';

// Fetch latest daily data and store in DB 
app.get('/live-price/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
    
    try {
      const response = await axios.get(url);
      const dailyData = response.data['Time Series (Daily)'];
  
      if (!dailyData) {
        return res.status(400).json({ error: 'No daily data found from API' });
      }
  
      const latestDate = Object.keys(dailyData)[0];
      const latestClose = dailyData[latestDate]['4. close'];
  
      res.json({ symbol, price: parseFloat(latestClose), date: latestDate });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data from API' });
    }
  });
  
  app.get('/stock_transactions/all', (req, res) => {
    const myquery = 'SELECT * FROM stock_transactions';
  
    connection.query(myquery, (err, results, fields) => {
      if (err) {
        console.log('Query failed: ' + err);
        return res.status(500).json({ error: 'Query failed' });
      }
  
      res.json(results); //  Send result to client
    });
  });

app.listen(3000, () => { console.log('Server is running on port 3000'); });