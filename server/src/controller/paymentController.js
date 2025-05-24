const crypto = require("crypto");

// PAYU_KEY = gtKFFx
// PAYU_SALT = 4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW



const PAYU_MERCHANT_KEY = "gtKFFx";
const PAYU_SALT = "4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW";
const PAYU_BASE_URL = "https://test.payu.in/_payment"; // use sandbox url for testing: https://test.payu.in/_payment

const initiatePayU = async (req, res) => {
  const {
    amount,
    firstname,
    email,
    phone,
    productinfo,
    txnid,
    surl,
    furl,
  } = req.body;

  console.log(amount,
    firstname,
    email,
    phone,
    productinfo,
    txnid,
    surl,
    furl,)

  // Prepare hash string
  const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  // Send back form data
  res.json({
    action: PAYU_BASE_URL,
    params: {
      key: PAYU_MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      hash,
      service_provider: "payu_paisa", // required by PayU
    },
  });
};


const handlePayUSuccess = async (req, res) => {
  const { txnid, status, mihpayid } = req.body;

  console.log("transaction Successfull")

  try {
    // Update the order based on txnid
    await Order.findOneAndUpdate(
      { txnid },
      {
        $set: {
          paymentStatus: status,
          paymentId: mihpayid,
          isPaid: true,
        },
      }
    );

    // Redirect to frontend success page
    res.redirect(`http://localhost:3000/payment-success?txnid=${txnid}`);
  } catch (err) {
    console.error("Error updating payment success:", err);
    res.status(500).send("Internal server error");
  }
};


const handlePayUFailure = async (req, res) => {
  const { txnid, status, error } = req.body;

  try {
    // Update the order based on txnid
    await Order.findOneAndUpdate(
      { txnid },
      {
        $set: {
          paymentStatus: status || "failed",
          isPaid: false,
          errorMessage: error || "Payment failed",
        },
      }
    );

    // Redirect to frontend failure page
    res.redirect(`http://localhost:3000/payment-failure?txnid=${txnid}`);
  } catch (err) {
    console.error("Error updating payment failure:", err);
    res.status(500).send("Internal server error");
  }
};


module.exports = { initiatePayU , handlePayUSuccess, handlePayUFailure};
