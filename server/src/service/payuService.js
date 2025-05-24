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

module.exports = { initiatePayU };
