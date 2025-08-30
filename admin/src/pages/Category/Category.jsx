import React, { useState, useEffect } from "react";
import "./Category.css";
import axios from "axios";
import { toast } from "react-toastify";

const Category = ({ url }) => {
  const [foodList, setFoodList] = useState([]);
  const [addonList, setAddonList] = useState([]);
  const [foodCategory, setFoodCategory] = useState({ name: "", type: "" });
  const [addonCategory, setAddonCategory] = useState({ name: "", type: "" });

  const onChnageHandler = (event, type) => {
    const name = event.target.name;
    const value = event.target.value;

    if (type === "food") {
      setFoodCategory({ [name]: value, type: "food" });
    } else {
      setAddonCategory({ [name]: value, type: "addon" });
    }
  };

  const onSubmitHandler = async (event, type) => {
    event.preventDefault();

    const data =
      type === "food"
        ? { name: foodCategory.name, type: foodCategory.type }
        : { name: addonCategory.name, type: addonCategory.type };

    const response = await axios.post(`${url}/api/category/add`, data);
    await fetchCategories();

    if (response.data.success) {
      setAddonCategory({ name: "", type: "" });
      setFoodCategory({ name: "", type: "" });
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  const fetchCategories = async () => {
    const response = await axios.get(`${url}/api/category/list`);
    console.log(response.data);
    if (response.data.success) {
      const foodCategories = response.data.data.filter(
        (entry) => entry.type === "food"
      );
      const addCategories = response.data.data.filter(
        (entry) => entry.type === "addon"
      );
      setFoodList(foodCategories);
      setAddonList(addCategories);
    } else {
      toast.error("Error");
    }
  };

  const removeCategory = async (categoryId) => {
    const response = await axios.post(`${url}/api/category/remove`, {
      categoryId: categoryId,
    });
    await fetchCategories();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category-page">
      <div className="items-categories">
        <div className="add">
          <form
            className="flex-col"
            onSubmit={(e) => onSubmitHandler(e, "food")}
          >
            <div className="add-category-name flex-col">
              <p>Food Category Name</p>
              <input
                onChange={(e) => onChnageHandler(e, "food")}
                value={foodCategory.name}
                type="text"
                name="name"
                placeholder="type here"
              />
            </div>

            <button type="submit" className="add-btn">
              ADD
            </button>
          </form>
        </div>

        <div className="list add flex-col">
          <p>Food Items Categories</p>
          <div className="cat-list-table">
            <div className="list-table-format title">
              <b>Name</b>
            </div>
            {foodList.map((item, index) => {
              return (
                <div key={index} className="cat-list-table-format">
                  <p>{item.name}</p>
                  <p
                    onClick={() => removeCategory(item.categoryId)}
                    className="cursor"
                  >
                    X
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="additionals-categories">
        <div className="add">
          <form
            className="flex-col"
            onSubmit={(e) => onSubmitHandler(e, "addon")}
          >
            <div className="add-category-name flex-col">
              <p>Addon Category Name</p>
              <input
                onChange={(e) => onChnageHandler(e, "addon")}
                value={addonCategory.name}
                type="text"
                name="name"
                placeholder="type here"
              />
            </div>

            <button type="submit" className="add-btn">
              ADD
            </button>
          </form>
        </div>

        <div className="list add flex-col">
          <p>All Addons Categories</p>
          <div className="cat-list-table">
            <div className="cat-list-table-format title">
              <b>Name</b>
            </div>
            {addonList.map((item, index) => {
              return (
                <div key={index} className="cat-list-table-format">
                  <p>{item.name}</p>
                  <p
                    onClick={() => removeCategory(item.categoryId)}
                    className="cursor"
                  >
                    X
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
