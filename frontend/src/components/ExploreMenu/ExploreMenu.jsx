import React, { useState, useEffect } from "react";
import "./ExploreMenu.css";
import axios from "axios";
import { assets } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory, url }) => {
  const [foodCategory, setFoodCategory] = useState([]);

  const fetchCategories = async () => {
    const response = await axios.get(`${url}/api/category/list`);

    if (response.data.success) {
      const foodCategories = response.data.data.filter(
        (entry) => entry.type === "food"
      );
      setFoodCategory(foodCategories);
    } else {
      console.log("Error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes. Our
        mission is to satisfy your craving and elevate your dining experience,
        one delicious meal at a time.
      </p>
      <div className="explore-menu-list">
        {foodCategory.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) => (prev === item.name ? "All" : item.name))
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img
                className={category === item.name ? "active" : ""}
                src={assets.pizzaCategory}
                alt=""
              />
              <p className="category-name">{item.name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
