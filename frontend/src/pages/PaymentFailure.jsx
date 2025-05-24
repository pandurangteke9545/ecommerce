import { useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const PaymentFailure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const txnid = params.get("txnid");

    const handleFailure = async () => {
      try {
        await api.post("/orders/update", {
          txnid,
          paymentMethod: "PayU",
          status: "failed",
        });
        alert("Payment failed.");
        navigate("/cart"); // back to cart
      } catch (err) {
        console.error("Update error:", err);
      }
    };

    handleFailure();
  }, []);

  return <h2>Payment failed. Redirecting...</h2>;
};

export default PaymentFailure;
