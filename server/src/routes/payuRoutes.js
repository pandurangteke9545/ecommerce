const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); // if using auth
const User = require('../models/User');
const { updateOrder } = require('../controller/orderController');
const payurouter = express.Router();
require('dotenv').config();
const crypto = require('crypto');

const PAYU_KEY = process.env.PAYU_KEY;
const PAYU_SALT = process.env.PAYU_SALT;

payurouter.post('/start-payment', async (req, res) => {
  const { amount,orderid, userid } = req.body;
  const user = await User.findById(userid);
    console.log( "User=",user)
  
  console.log("I am in the start payment");

  const key = PAYU_KEY; // Your PayU Merchant Key
  const txnid = 'txn_' + Date.now(); // Generating unique txnid
  const productinfo = 'Test Product';
  const firstname = user.name;
  const phone = '9876543210'; // Customer phone number
  const surl = 'https://ecommerce-hq8o.onrender.com/payment-success';
  const furl = 'https://ecommerce-hq8o.onrender.com/payment-failure'; 
  const salt = PAYU_SALT; // Your PayU Salt
  const udf1=orderid;
  const udf2=userid;
  const udf3=345;
  const udf4=567;
  const email = user.email
  
  // Generate hash
  const hash = generateHash(key, txnid, amount, productinfo, firstname, email,udf1,udf2,udf3,udf4,salt);
  
  // Send the form data as response
  res.send({
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    phone,
    surl,
    furl,
    salt,
    hash,
    udf1,
    udf2,
    udf3,
    udf4
  });
});


function generateHash(key, txnid, amount, productinfo, firstname, email,udf1,udf2,udf3,udf4,salt) {

  const input = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|||||||${salt}`;
  const hash = crypto.createHash('sha512').update(input).digest('hex');
  return hash;
}

async function validateHash(queryParams) {
  console.log("Inside queryParams--->", queryParams);
  const key = PAYU_KEY;
  const salt = PAYU_SALT;

  // Extract the necessary parameters from the query string (POST body)
  const txnid = queryParams.txnid;
  const amount = queryParams.amount;
  const productinfo = queryParams.productinfo;
  const firstname = queryParams.firstname;
  const email = queryParams.email;
  const udf1 = queryParams.udf1
  const udf2=queryParams.udf2
  const udf3 = queryParams.udf3
  const udf4=queryParams.udf4
  const receivedHash = queryParams.hash; // Hash received from PayU

  // Ensure all the required fields are non-empty
  if (!txnid || !amount || !productinfo || !firstname || !email || !receivedHash) {
    console.log("Missing fields in the response body!");
    return false;
  }

  // Recalculate the hash using the same parameters
  const input = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|||||||${salt}`;
  const calculatedHash = crypto.createHash('sha512').update(input).digest('hex');
  console.log("Calculated Hash:", calculatedHash);
  console.log("Received Hash:", receivedHash);

  // const calculatedHash = await generateHash(key, txnid, amount, productinfo, firstname, email,udf1,udf2,udf3,udf4,salt)

console.log("Recceived hash from payu",receivedHash)
// console.log("Calculated hash",calculatedHash)
  // Compare the calculated hash with the received hash
  return calculatedHash === receivedHash;
}


// Success route (changed to handle POST request properly)
payurouter.post('/payment-success', async (req, res) => {
  const { txnid, amount, status, hash, udf1, udf2 } = req.body;

  console.log('✅ Payment Success:', txnid, amount, status);

  const isValid = validateHash(req.body);
  console.log("Hash validation result:", isValid);

  if (!isValid) {
    return res.send(`<h1>Invalid Payment Data</h1>`);
  }

  try {
    const updatedOrder = await updateOrder({
      userId: udf2,
      orderId: udf1,
      transactionId: txnid,
      paymentMethod: "PayU",
      paymentStatus: status || "Success"
    });

    console.log("✅ Order updated:", updatedOrder);
   res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Payment Successful</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            font-family: 'Roboto', sans-serif;
            background-color: #f0f9f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .container {
            text-align: center;
            background: #ffffff;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 90%;
          }
          .icon {
            font-size: 3rem;
            color: #28a745;
            margin-bottom: 1rem;
          }
          h1 {
            color: #28a745;
          }
          p {
            margin: 0.5rem 0;
            font-size: 1rem;
          }
          .btn {
            margin-top: 1.5rem;
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          }
          .btn:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">✅</div>
          <h1>Payment Successful</h1>
          <p><strong>Transaction ID:</strong> ${txnid}</p>
          <p><strong>Amount:</strong> ₹${amount}</p>
          <p><strong>Status:</strong> ${status}</p>
          <a href="https://imaginative-douhua-90ccf5.netlify.app/orders" class="btn">My Orders</a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("❌ Failed to update order:", err);
    res.send(`<h1>Payment Received but Order Update Failed</h1>`);
  }
});


// Failure route (changed to handle POST request properly)

payurouter.post('/payment-failure', async (req, res) => {
  const { txnid, amount, status, error_message, udf1, udf2 } = req.body;

  console.log('❌ Payment Failure:', txnid, amount, status, error_message);

  if (!txnid || !amount || !status) {
    return res.send(`<h1>Invalid Payment Data</h1>`);
  }

  try {
    const updatedOrder = await updateOrder({
      userId: udf2,
      orderId: udf1,
      transactionId: txnid,
      paymentMethod: "PayU",
      paymentStatus: status || "Failed"
    });

    console.log("⚠️ Order updated with failure status:", updatedOrder);
  } catch (err) {
    console.error("❌ Failed to update order on failure:", err);
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Payment Failed</title>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          font-family: 'Roboto', sans-serif;
          background-color: #fcebea;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          text-align: center;
          background: #ffffff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          max-width: 400px;
          width: 90%;
        }
        .icon {
          font-size: 3rem;
          color: #dc3545;
          margin-bottom: 1rem;
        }
        h1 {
          color: #dc3545;
        }
        p {
          margin: 0.5rem 0;
          font-size: 1rem;
        }
        .btn {
          margin-top: 1.5rem;
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        }
        .btn:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">❌</div>
        <h1>Payment Failed</h1>
        <p><strong>Transaction ID:</strong> ${txnid}</p>
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p><strong>Error:</strong> ${error_message || 'Unknown error'}</p>
        <a href="http://localhost:5173/" class="btn">Home</a>
      </div>
    </body>
    </html>
  `);
});


// Webhook route to handle PayU notifications (async)
payurouter.post('/webhook', async (req, res) => {
  const notification = req.body;
  console.log("Received webhook notification:", notification);

  // PayU sends webhook notifications with txnid and status
  const { txnid, status, amount, hash } = notification;

  if (!txnid || !status || !amount || !hash) {
    console.log("Missing necessary data in the webhook notification");
    return res.status(400).send('Invalid data');
  }

  // Validate the hash sent in the webhook notification
  const isValid = validateHash(notification);
  if (isValid) {
    console.log(`Webhook Notification Valid: Payment for txnid ${txnid} is ${status}`);
    // Handle the successful or failed payment status as per your logic
    if (status === 'success') {
      // Handle success (e.g., update order status)
    } else {
      // Handle failure (e.g., update order status as failed)
    }
    res.status(200).send('Success');
  } else {
    console.log("Invalid Webhook Hash");
    res.status(400).send('Invalid hash');
  }
});


module.exports = payurouter;
