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
    categoryId: "",
    addons: [],
    isAvailable: 1,
  });
  const [addons, setaddons] = useState({
    name: "",
    categoryId: "",
    categoryName: "",
    price: "",
  });
  const [foodCategories, setFoodCategories] = useState([]);
  const [addonCategories, setAddonCategories] = useState([]);

  const fetchCategories = async () => {
    const response = await axios.get(`${url}/api/category/list`);

    if (response.data.success) {
      const itemCategories = response.data.data.filter(
        (entry) => entry.type === "food"
      );
      const addonCategories = response.data.data.filter(
        (entry) => entry.type === "addon"
      );

      setFoodCategories(itemCategories);
      setAddonCategories(addonCategories);
    } else {
      toast.error("Error");
    }
  };

  const onChnageHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onAddonChange = (event) => {
    const { name, value } = event.target;

    if (name === "categoryId") {
      // find the selected category object
      const selectedCategory = addonCategories.find(
        (cat) => cat.categoryId === value
      );

      setaddons((prev) => ({
        ...prev,
        categoryId: value,
        categoryName: selectedCategory ? selectedCategory.name : "",
      }));
    } else {
      setaddons((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addNewAddon = (event) => {
    event.preventDefault();

    let newaddonsList = data.addons;
    newaddonsList.push(addons);
    setData((data) => ({ ...data, addons: newaddonsList }));
  };

  const removeAddon = (event) => {
    const indexToRemove = Number(event.target.dataset.index); // or use id if you used `id`

    setData((prevData) => ({
      ...prevData,
      addons: prevData.addons.filter((_, i) => i !== indexToRemove),
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("categoryId", data.categoryId);
      formData.append("image", image);
      formData.append("isAvailable", data.isAvailable);

      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        addProductaddons(response.data.id);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error adding food:", err);
      toast.error("Failed to add food");
    }
  };

  const addProductaddons = async (foodId) => {
    const preparedaddons = data.addons.map((item) => ({ ...item }));
    console.log(preparedaddons);
    console.log(foodId);

    try {
      for (const addon of preparedaddons) {
        const response = await axios.post(`${url}/api/addOn/add`, {
          foodId: foodId,
          categoryId: addon.categoryId,
          name: addon.name,
          price: addon.price,
        });

        if (!response.data.success) {
          toast.error(response.data.message);
          return; // stop if failed
        }
      }

      // reset only if success
      setData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        addons: [], // 🔥 keep addons cleared
        isAvailable: 1,
      });
      setaddons({ name: "", categoryId: "", categoryName: "", price: "" });
      setImage(false);
      toast.success("All addons added successfully!");
    } catch (err) {
      console.error("Error adding addons:", err);
      toast.error("Failed to add addons");
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
            <select
              onChange={onChnageHandler}
              name="categoryId"
              defaultValue=""
            >
              <option value="" disabled>
                -- Select --
              </option>
              {foodCategories.map((item, index) => {
                return (
                  <option key={index} value={item.categoryId}>
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
            <p>Addon Name</p>
            <input
              value={addons.name}
              onChange={onAddonChange}
              type="text"
              name="name"
              placeholder="type here"
            />
          </div>

          <div className="add-category flex-col">
            <p>Addon Category</p>
            <select onChange={onAddonChange} name="categoryId" defaultValue="">
              <option value="" disabled>
                -- Select --
              </option>
              {addonCategories.map((item, index) => {
                return (
                  <option key={index} value={item.categoryId}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Addon Price</p>
            <input
              onChange={onAddonChange}
              value={addons.price}
              type="number"
              name="price"
              placeholder="$20"
            />
          </div>

          <button onClick={addNewAddon} className="add-sub-item">
            Add Addon
          </button>
        </div>

        <div className="list add-sub-item-table flex-col">
          <p>Addon List</p>
          <div className="sub-items-list-table">
            <div className="sub-items-list-table-format title">
              <b>Name</b>
              <b>Category</b>
              <b>Price</b>
            </div>
            {data.addons.length > 0
              ? data.addons.map((item, index) => {
                  return (
                    <div key={index} className="sub-items-list-table-format">
                      <p>{item.name}</p>
                      <p>{item.categoryName}</p>
                      <p>${item.price}</p>
                      <p
                        className="cursor"
                        onClick={removeAddon}
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
