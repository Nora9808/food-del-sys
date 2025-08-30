import React from "react";
import "./List.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const foodResponse = await axios.get(`${url}/api/food/list`);
    const categoryResponse = await axios.get(`${url}/api/category/list`);

    if (foodResponse.data.success && categoryResponse.data.success) {
      let newFoodList = [];
      for (let catFood of foodResponse.data.data) {
        const foodAddonResponse = await axios.get(
          `${url}/api/addOn/listFoodAddons`,
          { params: { foodId: catFood.foodId } }
        );

        if (foodAddonResponse.data.success) {
          let catId = catFood.categoryId;

          let getCatName = categoryResponse.data.data.filter(
            (x) => x.categoryId === catId
          );

          catFood = {
            ...catFood,
            category: getCatName[0].name,
            addonData: foodAddonResponse.data.data,
          };
          newFoodList.push(catFood);
        }
      }
      setList(newFoodList);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    const foodAddonResponse = await axios.post(
      `${url}/api/addOn/removeFoodAddons`,
      {
        foodId: foodId,
      }
    );

    if (foodAddonResponse.data.success) {
      const foodResponse = await axios.post(`${url}/api/food/remove`, {
        foodId: foodId,
      });

      if (foodResponse.data.success) {
        await fetchList();
        toast.success("Food and Food Addons are deleted successfully");
      } else {
        toast.error("Error deleting Food and Food Addons");
      }
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Addons</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>
                {item.addonData.map((addon, index) => (
                  <span key={index}>
                    {addon.name} - ${addon.price}
                    {index < item.addonData.length - 1 && <br />}
                  </span>
                ))}
              </p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={() => removeFood(item.foodId)} className="cursor">
                X
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
