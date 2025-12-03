import React, { useContext } from "react";
import "./FoodItem.css";
import { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const FoodItem = ({ foodId, name, price, description, image, addons }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  const [showAddons, setShowAddons] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [addonCategory, setAddonCategory] = useState([]);

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

  const findCategories = async () => {
    const response = await axios.get(`${url}/api/category/list`);

    if (response.data.success) {
      const addonCategories = response.data.data.filter(
        (entry) => entry.type === "addon"
      );
      setAddonCategory(addonCategories); // store categories in state
    } else {
      console.log("Error fetching categories");
    }
  };

  useEffect(() => {
    findCategories();
  }, []);

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
                // Group addons by category
                addonCategory.map((category) => {
                  // Filter addons for this category
                  const addonsForCategory = addons.filter(
                    (addon) => addon.categoryId === category.categoryId
                  );
                  if (addonsForCategory.length === 0) return null; // skip empty categories

                  return (
                    <div key={category.categoryId} className="addon-category">
                      <h6>{category.name}:</h6>
                      {addonsForCategory.map((addon) => (
                        <label className="addon-label" key={addon.foodAddId}>
                          <input
                            type="checkbox"
                            checked={selectedAddons.some(
                              (a) => a.id === addon.foodAddId
                            )}
                            onChange={() => toggleAddonSelection(addon)}
                          />
                          {addon.name} (+${addon.price})
                        </label>
                      ))}
                    </div>
                  );
                })
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
