import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function Verify() {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    if (success === "true") {
      await axios.post(url + "/api/order/payment", {
        paymentStatus: "paid",
        orderId: orderId,
      });

      await axios.post(url + "/api/order/orderStatus", {
        orderStatus: "accepted",
        orderId: orderId,
      });

      await axios.post(url + "/api/cart/removeAll", {}, { headers: { token } });

      navigate("/myorders");
    } else {
      await axios.post(url + "/api/order/payment", {
        paymentStatus: "cancelled",
        orderId: orderId,
      });

      await axios.post(url + "/api/order/orderStatus", {
        orderStatus: "pending",
        orderId: orderId,
      });

      navigate("/cart");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);
  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
}

export default Verify;
