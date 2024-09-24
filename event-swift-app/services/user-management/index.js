const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3014;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from services!');
});


app.listen(PORT, () => {
  console.log("Server running on port ${PORT}");
});

