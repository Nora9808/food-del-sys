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
    const addonId = addon.foodAddId;

    setSelectedAddons((prev) => {
      if (prev.find((a) => a.id === addonId)) {
        // remove if already selected
        return prev.filter((a) => a.id !== addonId);
      } else {
        // add if not selected
        return [...prev, { id: addonId }];
      }
    });
  };

  const handleAddToCart = () => {
    let quantity = 1;
    addToCart(foodId, parseFloat(price), quantity, selectedAddons);
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
              onClick={() => setShowAddons(true)}
              src={assets.add_icon_green}
              alt="Add More"
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          {/*<img src={assets.rating_starts} alt="rating" />*/}
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
                  <React.Fragment key={addon.foodAddId}>
                    <label className="addon-label">
                      <input
                        type="checkbox"
                        checked={selectedAddons.some(
                          (a) => a.id === addon.foodAddId
                        )}
                        onChange={() => toggleAddonSelection(addon)}
                      />
                      {addon.name} (+${addon.price})
                    </label>
                    <br />
                  </React.Fragment>
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
