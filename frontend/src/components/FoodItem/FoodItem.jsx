import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ foodId, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  // Find if this food is already in cart
  const cartItem = cartItems.find((item) => item.food.foodId === foodId);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={url + "/images/" + image}
          alt={name}
        />

        {!cartItem ? (
          <img
            className="add"
            onClick={() => addToCart(foodId)}
            src={assets.add_icon_white}
            alt="Add"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(cartItem.cartItemId)}
              src={assets.remove_icon_red}
              alt="Remove"
            />
            <p>{cartItem.quantity}</p>
            <img
              onClick={() => addToCart(foodId)}
              src={assets.add_icon_green}
              alt="Add More"
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>

        {/* Show addons if present */}
        {cartItem?.addons?.length > 0 && (
          <div className="food-item-addons">
            <p>Addons:</p>
            <ul>
              {cartItem.addons.map((addon) => (
                <li key={addon.foodAddId}>
                  {addon.name} (+${addon.price})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItem;
