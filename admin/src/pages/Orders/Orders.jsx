import React from "react";
import "./Orders.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/allOrders");
    if (response.data.success) {
      setOrders(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/orderStatus", {
      orderId: orderId,
      orderStatus: event.target.value,
    });

    if (response.data.success) {
      await fetchAllOrders();
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => {
          return (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + ", ";
                    }
                  })}
                </p>
                <p className="order-item-name">
                  {order.firstName + " " + order.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address + ","}</p>
                  <p>
                    {order.city +
                      ", " +
                      order.province +
                      ", " +
                      order.country +
                      ", " +
                      order.postalCode}
                  </p>
                </div>
                <p className="order-item-phone">{order.phoneNumber}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>${order.totalAmount}</p>
              <select
                onChange={(event) => statusHandler(event, order.orderId)}
                value={order.orderStatus}
              >
                <option value="accepted">Accepted</option>
                <option value="pending">Pending</option>
                <option value="out for delivery">Out for delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
