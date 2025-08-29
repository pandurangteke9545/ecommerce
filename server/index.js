const express = require('express');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const authrouter = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartrouter = require('./src/routes/cartRoutes');
const orderrouter = require('./src/routes/orderRoutes');
const payurouter = require('./src/routes/payuRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const {init} = require("./src/service/socket");

app.use(
  cors({
    origin: ["http://localhost:5173","https://imaginative-douhua-90ccf5.netlify.app"] ,          
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();
app.use('/api/auth', authrouter);
app.use('/api/products', productRoutes);
app.use('/api', cartrouter);
app.use('/api/orders', orderrouter);
app.use('/api/payu/' , payurouter); 
app.use('/api/user',userRoutes);


const {createServer}  = require('http')
const { Server } = require("socket.io");
const httpServer = createServer(app);
init(httpServer)

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



