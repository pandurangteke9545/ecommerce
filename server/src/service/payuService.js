// // const crypto = require("crypto");
// // const PAYU_KEY = process.env.PAYU_KEY;
// // const PAYU_SALT = process.env.PAYU_SALT;

// // const generateHash = (params) => {
// //   const {
// //     key,
// //     txnid,
// //     amount,
// //     productinfo,
// //     firstname,
// //     email,
// //     udf1 = "",
// //     udf2 = "",
// //     udf3 = "",
// //     udf4 = "",
// //   } = params;

// //   const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|||||||${PAYU_SALT}`;
// //   return crypto.createHash("sha512").update(hashString).digest("hex");
// // };




// // const validateHash = (params, receivedHash) => {
// //   const hash = generateHash({
// //     key: PAYU_KEY,
// //     txnid: params.txnid,
// //     amount: params.amount,
// //     productinfo: params.productinfo,
// //     firstname: params.firstname,
// //     email: params.email,
// //     udf1: params.udf1,
// //     udf2: params.udf2,
// //     udf3: params.udf3,
// //     udf4: params.udf4,
// //   });

// //   return hash === receivedHash;
// // };

// // module.exports = { generateHash, validateHash };



// // const crypto = require("crypto");


// // // PAYU_KEY = gtKFFx
// // // PAYU_SALT = 4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW


// // const PAYU_MERCHANT_KEY = "gtKFFx";
// // const PAYU_SALT = "4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW";
// // const PAYU_BASE_URL = "https://test.payu.in/_payment"; // use sandbox url for testing: https://test.payu.in/_payment


// // const initiatePayU = async (req, res) => {
// //   const {
// //     amount,
// //     firstname,
// //     email,
// //     phone,
// //     productinfo,
// //     txnid,
// //     surl,
// //     furl,
// //   } = req.body;


// //   // Prepare hash string
// //   const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
// //   const hash = crypto.createHash("sha512").update(hashString).digest("hex");


// //   // Send back form data
// //   res.json({
// //     action: PAYU_BASE_URL,
// //     params: {
// //       key: PAYU_MERCHANT_KEY,
// //       txnid,
// //       amount,
// //       productinfo,
// //       firstname,
// //       email,
// //       phone,
// //       surl,
// //       furl,
// //       hash,
// //       service_provider: "payu_paisa", // required by PayU
// //     },
// //   });
// // };


// // module.exports = { initiatePayU };




// import crypto from 'crypto'
// import Users from '../models/users.js';
// import { createPayment } from '../controllers/paymentController.js';


// export function paymentinitiate(
//   amount,
//   productinfo,
//   firstname,
//   email,
//   phone,
// ) {
 
//   console.log("I am in the start payment");


//   const key = process.env.PAYU_KEY; 
//   const salt = process.env.PAYU_SALT; 
//   const txnid = 'txn' + Date.now(); 
//   const udf1 = ""
//   const udf2 = ""
//   const udf3 = ""
//   const udf4 = ""
//   console.log("Transaction Id from backend", txnid)
//   const surl = 'http://localhost:5000/success'; // Success URL
//   const furl = 'http://localhost:5000/failure'; // Failure URL


//   const hash = generateHash(key, txnid, amount, productinfo, firstname, email,udf1,udf2,udf3,udf4,salt);

//   return {
//     key,
//     txnid,
//     amount,
//     productinfo,
//     firstname,
//     email,
//     phone,
//     surl,
//     furl,
//     hash,
//     udf1,udf2,udf3,udf4
//   };
// }


// // Hash generation logic (SHA-512)
// function generateHash(key, txnid, amount, productinfo, firstname, email,udf1,udf2,udf3,udf4,salt) {
//   const input = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|||||||${salt}`;
//   return crypto.createHash('sha512').update(input).digest('hex');
// }



// export  async function  validateHash(queryParams) {
//     console.log("🔍 Inside validateHash, queryParams:", queryParams);
//   const key = process.env.PAYU_KEY; // Your PayU Merchant Key
//   const salt = process.env.PAYU_SALT
//   const {
//     txnid,
//     amount,
//     productinfo,
//     firstname,
//     email,
//     udf1,
//     udf2,
//     udf3,
//     udf4,
//     hash,
//     mode,
//     payment_source,
//     status,
//     phone,
//     mihpayid
//   } = queryParams;

//     if (!txnid || !amount || !productinfo || !firstname || !email || !hash) {
//       console.warn("❌ Missing one or more required fields in the response body!");
//       return false;
//     }

//     try {
//         const calculatedHash = generateHash;
//         const customerInfo =await  Users.findOne({
//             where: {
//               mobile_no: phone,  // Match phone with mobile_no in the Users table
//             },
//             attributes: ["id"],
//             raw: true, // Returns plain object instead of Sequelize instance
//           });
       
//           console.log("This is customer info", customerInfo);
       
//           let customer_id = null;
       
//           if (customerInfo) {
//             customer_id = customerInfo.id;
//           }
//           console.log("This is payment info",
//             productinfo,amount,mode,payment_source,status,hash,customer_id,email,phone
//           )

//           // const payment = createPayment(productinfo,txnid,mihpayid,status,amount,'INR',mode,payment_source,hash,'not_applied',
//           //   customer_id,email,String(phone),udf1,udf2,udf3,udf4,
//         // )
   
//       console.log("✅ Calculated Hash:", calculatedHash);
//       console.log("📥 Received Hash from PayU:", hash);
//       return calculatedHash === hash;
//     } catch (error) {
//       console.error("🔥 Error while calculating hash:", error);
//       return false;
//     }
//   }

// module.exports = paymentinitiate;



