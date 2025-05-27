// // const crypto = require("crypto");

// // const PAYU_MERCHANT_KEY = process.env.PAYU_KEY
// // const PAYU_SALT = process.env.PAYU_SALT
// // const PAYU_BASE_URL = "https://test.payu.in/_payment"; 

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

// //   console.log(amount,
// //     firstname,
// //     email,
// //     phone,
// //     productinfo,
// //     txnid,
// //     surl,
// //     furl,)

// //   // Prepare hash string
// //   const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
// //   const hash = crypto.createHash("sha512").update(hashString).digest("hex");

// //   console.log("hash value : -",hash)

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




// // const handlePayUSuccess = async (req, res) => {
// //   const { txnid, status, mihpayid } = req.body;

// //   console.log("transaction Successfull")

// //   try {
// //     // Update the order based on txnid
// //     await Order.findOneAndUpdate(
// //       { txnid },
// //       {
// //         $set: {
// //           paymentStatus: status,
// //           paymentId: mihpayid,
// //           isPaid: true,
// //         },
// //       }
// //     );

// //     // Redirect to frontend success page
// //     res.redirect(`http://localhost:3000/payment-success?txnid=${txnid}`);
// //   } catch (err) {
// //     console.error("Error updating payment success:", err);
// //     res.status(500).send("Internal server error");
// //   }
// // };


// // const handlePayUFailure = async (req, res) => {
// //   const { txnid, status, error } = req.body;

// //   try {
// //     // Update the order based on txnid
// //     await Order.findOneAndUpdate(
// //       { txnid },
// //       {
// //         $set: {
// //           paymentStatus: status || "failed",
// //           isPaid: false,
// //           errorMessage: error || "Payment failed",
// //         },
// //       }
// //     );

// //     // Redirect to frontend failure page
// //     res.redirect(`http://localhost:3000/payment-failure?txnid=${txnid}`);
// //   } catch (err) {
// //     console.error("Error updating payment failure:", err);
// //     res.status(500).send("Internal server error");
// //   }
// // };


// // module.exports = { initiatePayU , handlePayUSuccess, handlePayUFailure};



// const { generateHash, validateHash } = require("../service/payuService");
// const PAYU_KEY = process.env.PAYU_KEY;
// const PAYU_BASE_URL = "https://test.payu.in/_payment";
// const Order = require("../models/Order"); // Ensure this exists

// const initiatePayU = async (req, res) => {
//   const {
//     amount,
//     firstname,
//     email,
//     phone,
//     productinfo,
//     txnid,
//     surl,
//     furl,
//   } = req.body;

//   const hash = generateHash({
//     key: PAYU_KEY,
//     txnid,
//     amount,
//     productinfo,
//     firstname,
//     email,
//   });

//   res.json({
//     action: PAYU_BASE_URL,
//     params: {
//       key: PAYU_KEY,
//       txnid,
//       amount,
//       productinfo,
//       firstname,
//       email,
//       phone,
//       surl,
//       furl,
//       hash,
//       service_provider: "payu_paisa",
//     },
//   });
// };

// const handlePayUSuccess = async (req, res) => {
//   const { txnid, status, mihpayid, hash } = req.body;

//   const isValid = validateHash(req.body, hash);

//   if (!isValid) {
//     return res.status(400).send("Invalid payment hash");
//   }

//   try {
//     await Order.findOneAndUpdate(
//       { txnid },
//       {
//         $set: {
//           paymentStatus: status,
//           paymentId: mihpayid,
//           isPaid: true,
//         },
//       }
//     );

//     res.redirect(`http://localhost:3000/payment-success?txnid=${txnid}`);
//   } catch (err) {
//     console.error("Error updating payment success:", err);
//     res.status(500).send("Internal server error");
//   }
// };

// const handlePayUFailure = async (req, res) => {
//   const { txnid, status, error, hash } = req.body;

//   const isValid = validateHash(req.body, hash);

//   if (!isValid) {
//     return res.status(400).send("Invalid payment hash");
//   }

//   try {
//     await Order.findOneAndUpdate(
//       { txnid },
//       {
//         $set: {
//           paymentStatus: status || "failed",
//           isPaid: false,
//           errorMessage: error || "Payment failed",
//         },
//       }
//     );

//     res.redirect(`http://localhost:3000/payment-failure?txnid=${txnid}`);
//   } catch (err) {
//     console.error("Error updating payment failure:", err);
//     res.status(500).send("Internal server error");
//   }
// };

// module.exports = { initiatePayU, handlePayUSuccess, handlePayUFailure };
