import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, getTotalCartAmount, url, token } =
    useContext(StoreContext);

  const navigate = useNavigate();
  console.log(token);
  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Addons</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {cartItems.map((item, index) => {
          return (
            <div key={index}>
              <div className="cart-items-title cart-items-item">
                <img src={url + "/images/" + item.food.image} alt="" />
                <p>{item.food.name}</p>
                <p>
                  {item.addons.map((addon, index) => (
                    <span key={index}>
                      {addon.name} - ${addon.price}
                      {index < item.addons.length - 1 && <br />}
                    </span>
                  ))}
                </p>
                <p>${item.food.price}</p>
                <p>{item.quantity}</p>
                <p>
                  $
                  {(
                    parseFloat(item.food.price) * item.quantity +
                    item.addons.reduce(
                      (sum, addon) => sum + parseFloat(addon.price),
                      0
                    )
                  ).toFixed(2)}
                </p>
                <p onClick={() => removeFromCart(item._id)} className="cross">
                  x
                </p>
              </div>
              <hr />
            </div>
          );
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            PROCEES TO CHECKOUT
          </button>
        </div>

        <div className="cart-promo-code">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
