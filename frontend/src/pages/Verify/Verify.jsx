import React, { createRef, useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function Verify() {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      if (success === "true") {
        await axios.post(url + "/api/order/payment", {
          paymentStatus: "paid",
          orderId: orderId,
        });

        await axios.post(url + "/api/order/orderStatus", {
          orderStatus: "accepted",
          orderId: orderId,
        });

        let cartId = localStorage.getItem("cartId");
        // Remove all cart items
        const res = await axios.post(`${url}/api/cart/removeAll`, {
          cartId: cartId,
        });

        console.log(cartId);
        console.log(res);

        if (res.data.success) {
          setCartItems([]);
        }

        navigate("/");
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
    } catch (error) {
      console.error("Error verifying payment:", err);
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
