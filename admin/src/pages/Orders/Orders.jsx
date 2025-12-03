import React from "react";
import "./Orders.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/allOrders");
    if (response.data.success) {
      console.log(response.data.data);
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
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            {/* Left Column: Items + Addons */}
            <div className="order-item-column order-item-left">
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className="order-item-food">
                  <p>
                    {item.name} x {item.quantity} - ${item.priceAtOrder}
                  </p>
                  {item.addons && item.addons.length > 0 && (
                    <ul className="order-item-addons">
                      {item.addons.map((addon, addonIndex) => (
                        <li key={addonIndex}>
                          {addon.name} - ${addon.price}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <p>Items: {order.items.length}</p>
              <p>Total: ${order.totalAmount}</p>

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

            {/* Right Column: Customer Info */}
            <div className="order-item-column order-item-right">
              <p className="order-item-name">
                {order.firstName} {order.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address},</p>
                <p>
                  {order.city}, {order.province}, {order.country},{" "}
                  {order.postalCode}
                </p>
              </div>
              <p className="order-item-phone">{order.phoneNumber}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
