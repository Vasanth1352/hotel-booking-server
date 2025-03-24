const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Allow all origins (dev only)
app.use(cors());
app.use(express.json());

// Routes
const hotelRoutes = require('./routes/hotels');
const roomRoutes = require('./routes/rooms');
const customerRoutes = require('./routes/customers');
const bookingRoutes = require('./routes/bookings');

app.use('/hotels', hotelRoutes);
app.use('/rooms', roomRoutes);
app.use('/customers', customerRoutes);
app.use('/bookings', bookingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
