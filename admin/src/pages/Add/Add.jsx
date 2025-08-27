import React, { useEffect } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subItems: [],
  });
  const [subItems, setSubItems] = useState({
    name: "",
    category: "",
    price: "",
  });
  const [productCategories, setProductCategoreis] = useState([]);
  const [subItemCategories, setSubItemCategories] = useState([]);

  const fetchCategories = async () => {
    const response = await axios.get(`${url}/api/category/list`);

    if (response.data.success) {
      const itemCategories = response.data.data.filter(
        (entry) => entry.type === "item"
      );
      const subItemCategories = response.data.data.filter(
        (entry) => entry.type === "additional"
      );
      setProductCategoreis(itemCategories);
      setSubItemCategories(subItemCategories);
    } else {
      toast.error("Error");
    }
  };

  const onChnageHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubItemsChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setSubItems((data) => ({ ...data, [name]: value }));
  };

  const addSubItem = (event) => {
    event.preventDefault();
    let newSubItemsList = data.subItems;
    newSubItemsList.push(subItems);
    setData((data) => ({ ...data, subItems: newSubItemsList }));
  };

  const removeSubItem = (event) => {
    const indexToRemove = Number(event.target.dataset.index); // or use id if you used `id`

    setData((prevData) => ({
      ...prevData,
      subItems: prevData.subItems.filter((_, i) => i !== indexToRemove),
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    const response = await axios.post(`${url}/api/food/add`, formData);
    if (response.data.success) {
      addProductSubItems(response.data.id);
      setData({
        name: "",
        description: "",
        price: "",
        category: "",
      });
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  const addProductSubItems = async (id) => {
    const preparedSubItems = data.subItems.map((item) => ({
      ...item,
      productId: id,
    }));

    const response = await axios.post(`${url}/api/food/addSubItem`, {
      subItems: preparedSubItems,
    });

    if (response.data.success) {
      setSubItems({
        name: "",
        category: "",
        price: "",
      });
      setImage(false);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            onChange={onChnageHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="type here"
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            onChange={onChnageHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>

        <div className="add-categgory-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChnageHandler} name="category" defaultValue="">
              <option value="" disabled>
                -- Select --
              </option>
              {productCategories.map((item, index) => {
                return (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              onChange={onChnageHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="$20"
            />
          </div>
        </div>

        <div className="sub-product-items">
          <div className="add-sub-item-name flex-col">
            <p>Sub-Item Name</p>
            <input
              value={subItems.name}
              onChange={onSubItemsChange}
              type="text"
              name="name"
              placeholder="type here"
            />
          </div>

          <div className="add-category flex-col">
            <p>Sub-Item Category</p>
            <select onChange={onSubItemsChange} name="category" defaultValue="">
              <option value="" disabled>
                -- Select --
              </option>
              {subItemCategories.map((item, index) => {
                return (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Sub-Item Price</p>
            <input
              onChange={onSubItemsChange}
              value={subItems.price}
              type="number"
              name="price"
              placeholder="$20"
            />
          </div>

          <button onClick={addSubItem} className="add-sub-item">
            Add Sub-Item
          </button>
        </div>

        <div className="list add-sub-item-table flex-col">
          <p>Sub-Items List</p>
          <div className="sub-items-list-table">
            <div className="sub-items-list-table-format title">
              <b>Name</b>
              <b>Category</b>
              <b>Price</b>
            </div>
            {data.subItems.length > 0
              ? data.subItems.map((item, index) => {
                  return (
                    <div key={index} className="sub-items-list-table-format">
                      <p>{item.name}</p>
                      <p>{item.category}</p>
                      <p>${item.price}</p>
                      <p
                        className="cursor"
                        onClick={removeSubItem}
                        data-index={index}
                      >
                        X
                      </p>
                    </div>
                  );
                })
              : null}
          </div>
        </div>

        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
