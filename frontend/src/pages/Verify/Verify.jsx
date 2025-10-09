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
      const paymentResponse = await axios.post(url + "/api/order/payment", {
        paymentStatus: "paid",
        orderId: orderId,
      });

      const orderResponse = await axios.post(url + "/api/order/orderStatus", {
        orderStatus: "accepted",
        orderId: orderId,
      });

      if (paymentResponse.data.success && orderResponse.data.success) {
        await axios.post(
          url + "/api/cart/removeAll",
          {},
          { headers: { token } }
        );

        navigate("/myorders");
      } else {
        navigate("/");
      }
    } else {
      const paymentResponse2 = await axios.post(url + "/api/order/payment", {
        paymentStatus: "cancelled",
        orderId: orderId,
      });

      const orderResponse2 = await axios.post(url + "/api/order/orderStatus", {
        orderStatus: "pending",
        orderId: orderId,
      });

      if (paymentResponse2.data.success && orderResponse2.data.success) {
        navigate("/cart");
      } else {
        navigate("/");
      }
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
