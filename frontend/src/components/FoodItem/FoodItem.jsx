import React, { useContext } from "react";
import "./FoodItem.css";
import { useState } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ foodId, name, price, description, image, addons }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  const [showAddons, setShowAddons] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Find if this food is already in cart
  const cartItem = cartItems.find((item) => item.food.foodId === foodId);

  const toggleAddonSelection = (addon) => {
    if (selectedAddons.find((a) => a.foodAddId === addon.foodAddId)) {
      // remove if already selected
      setSelectedAddons(
        selectedAddons.filter((a) => a.foodAddId !== addon.foodAddId)
      );
    } else {
      // add if not selected
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAddToCart = () => {
    addToCart(foodId);
    setShowAddons(false);
    setSelectedAddons([]);
  };

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
            onClick={() => setShowAddons(true)}
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

        {/* Addons modal */}
        {showAddons && (
          <div className="addons-modal">
            <div className="addons-modal-content">
              <h5>Select Addons</h5>
              {addons.length === 0 ? (
                <p>No addons available</p>
              ) : (
                addons.map((addon) => (
                  <>
                    <label key={addon.foodAddId} className="addon-label">
                      <input
                        type="checkbox"
                        checked={selectedAddons.some(
                          (a) => a.foodAddId === addon.foodAddId
                        )}
                        onChange={() => toggleAddonSelection(addon)}
                      />
                      {addon.name} (+${addon.price})
                    </label>
                    <br />
                  </>
                ))
              )}
              <div className="addons-modal-actions">
                <button onClick={handleAddToCart}>Add to Cart</button>
                <button onClick={() => setShowAddons(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItem;
