import React, { useState, useEffect } from "react";
import "./Category.css";
import axios from "axios";
import { toast } from "react-toastify";

const Category = ({ url }) => {
  const [itemList, setItemList] = useState([]);
  const [addList, setAddList] = useState([]);
  const [itemCategory, setItemCategory] = useState({ name: "", type: "" });
  const [addCategory, setAddCategory] = useState({ name: "", type: "" });

  const onChnageHandler = (event, type) => {
    const name = event.target.name;
    const value = event.target.value;

    if (type === "item") {
      setItemCategory({ [name]: value, type: "item" });
    } else {
      setAddCategory({ [name]: value, type: "additional" });
    }
  };

  const onSubmitHandler = async (event, type) => {
    event.preventDefault();

    const data =
      type === "item"
        ? { name: itemCategory.name, type: itemCategory.type }
        : { name: addCategory.name, type: addCategory.type };

    const response = await axios.post(`${url}/api/category/add`, data);
    await fetchCategories();

    if (response.data.success) {
      setAddCategory({ name: "", type: "" });
      setItemCategory({ name: "", type: "" });
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  const fetchCategories = async () => {
    const response = await axios.get(`${url}/api/category/list`);
    console.log(response.data);
    if (response.data.success) {
      const itemCategories = response.data.data.filter(
        (entry) => entry.type === "item"
      );
      const addCategories = response.data.data.filter(
        (entry) => entry.type === "additional"
      );
      setItemList(itemCategories);
      setAddList(addCategories);
    } else {
      toast.error("Error");
    }
  };

  const removeCategory = async (categoryId) => {
    const response = await axios.post(`${url}/api/category/remove`, {
      id: categoryId,
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
            onSubmit={(e) => onSubmitHandler(e, "item")}
          >
            <div className="add-category-name flex-col">
              <p>Items Category Name</p>
              <input
                onChange={(e) => onChnageHandler(e, "item")}
                value={itemCategory.name}
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
          <p>All Items Categories</p>
          <div className="cat-list-table">
            <div className="list-table-format title">
              <b>Name</b>
            </div>
            {itemList.map((item, index) => {
              return (
                <div key={index} className="cat-list-table-format">
                  <p>{item.name}</p>
                  <p
                    onClick={() => removeCategory(item._id)}
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
            onSubmit={(e) => onSubmitHandler(e, "add")}
          >
            <div className="add-category-name flex-col">
              <p>Additionals Category Name</p>
              <input
                onChange={(e) => onChnageHandler(e, "add")}
                value={addCategory.name}
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
          <p>All Additionals Categories</p>
          <div className="cat-list-table">
            <div className="cat-list-table-format title">
              <b>Name</b>
            </div>
            {addList.map((item, index) => {
              return (
                <div key={index} className="cat-list-table-format">
                  <p>{item.name}</p>
                  <p
                    onClick={() => removeCategory(item._id)}
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
