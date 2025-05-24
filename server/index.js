const express = require('express');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const payuRoutes = require('./src/routes/payuRoutes')
const cookieParser = require('cookie-parser');


const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // your Vite frontend port
    credentials: true,
  })
);



app.use(express.json());
app.use(cookieParser());

connectDB();


// app.get('/', (req, res) => {
//   res.send('Hello from Node.js Backend!');
// });

app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);

app.use('/api', cartRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/payu' , payuRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
