const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/stations', async (req, res) => {
  try {
    const token = process.env.NOAA_TOKEN;
    if (!token) {
      return res.status(400).json({ error: 'NOAA API token nie został skonfigurowany. Proszę dodać klucz NOAA_TOKEN.' });
    }

    const base = 'https://www.ncei.noaa.gov/cdo-web/api/v2/stations';
    const allowed = ['datasetid', 'locationid', 'startdate', 'enddate', 'datatypeid', 'limit', 'offset', 'sortfield', 'sortorder', 'extent'];
    const params = {};
    for (const k of allowed) {
      if (req.query[k]) params[k] = req.query[k];
    }
    if (!params.limit) params.limit = 1000;

    const response = await axios.get(base, {
      headers: {
        token: token
      },
      params
    });

    res.json(response.data);
  } catch (err) {
    console.error('Error fetching stations:', err && err.response ? err.response.data : err.message);
    if (err.response) {
      res.status(err.response.status).json({ error: err.response.data || err.response.statusText });
    } else {
      res.status(500).json({ error: err.message || 'Unknown error' });
    }
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
