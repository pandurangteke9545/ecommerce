import { useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const txnid = params.get("txnid");

    // Call backend to update order/payment
    const handleSuccess = async () => {
      try {
        await api.post("/orders/update", {
          txnid,
          paymentMethod: "PayU",
          status: "success",
        });
        alert("Payment successful!");
        navigate("/orders"); // redirect to orders page or home
      } catch (err) {
        console.error("Update failed:", err);
      }
    };

    handleSuccess();
  }, []);

  return <h2>Processing your payment...</h2>;
};

export default PaymentSuccess;
