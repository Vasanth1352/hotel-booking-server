const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./db"); // Import database connection from db.js

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
