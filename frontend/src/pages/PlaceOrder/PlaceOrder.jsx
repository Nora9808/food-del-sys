import React, { useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useContext } from "react";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, cartItems, url, promoCodeData } =
    useContext(StoreContext);
  const { subtotal, deliveryFee, hstAmount, total, discountAmount } =
    getTotalCartAmount();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    province: "",
    postalcode: "",
    country: "",
    phone: "",
  });

  const onChnageHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];

    cartItems.map((item) => {
      let addonPrice = 0;
      let addonIds = [];
      item.addons.map((addon) => {
        addonPrice += parseFloat(addon.price);
        addonIds.push({ id: addon.foodAddId });
      });

      let itemPrice = parseFloat(item.food.price) * parseInt(item.quantity);
      orderItems.push({
        foodId: item.food.foodId,
        name: item.food.name,
        quantity: parseInt(item.quantity),
        priceAtOrder: parseFloat(item.food.price),
        totalItemsPrice: itemPrice + addonPrice,
        addonsIds: addonIds,
      });
    });

    let orderData = {
      totalAmount: total,
      promoCode: promoCodeData.disCode,
      promoType: promoCodeData.discountType,
      promoAmount: promoCodeData.discountAmount,
      discountAmount: discountAmount,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      country: data.country,
      city: data.city,
      province: data.province,
      postalCode: data.postalcode,
      phoneNumber: data.phone,
      orderStatus: "pending",
      deliveryMethod: "pickup",
      deliveryTime: "2025-09-10 23:52:48",
      paymentStatus: "pending",
      items: orderItems,
    };

    let response = await axios.post(url + "/api/order/place", orderData);

    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("Error");
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChnageHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChnageHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>

        <input
          required
          name="address"
          onChange={onChnageHandler}
          value={data.address}
          type="text"
          placeholder="Address"
        />

        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChnageHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="province"
            onChange={onChnageHandler}
            value={data.province}
            type="text"
            placeholder="Province"
          />
        </div>

        <div className="multi-fields">
          <input
            required
            name="postalcode"
            onChange={onChnageHandler}
            value={data.postalcode}
            type="text"
            placeholder="Postal Code"
          />
          <input
            required
            name="country"
            onChange={onChnageHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>

        <input
          required
          name="phone"
          onChange={onChnageHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>HST(13%)</p>
              <p>${subtotal === 0 ? 0 : hstAmount}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${subtotal === 0 ? 0 : deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>
                Promo{" "}
                {promoCodeData && promoCodeData.discountAmount != null // ensures discountAmount is defined
                  ? promoCodeData.discountType === "percent"
                    ? `${promoCodeData.discountAmount}%`
                    : `$${promoCodeData.discountAmount}`
                  : ""}
              </p>
              <p>-${subtotal === 0 ? 0 : discountAmount}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${subtotal === 0 ? 0 : total}</b>
            </div>
          </div>
          <button type="submit">PROCEES TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
