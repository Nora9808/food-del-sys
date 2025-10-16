import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (foodId, price, quantity, selectedAddons) => {
    console.log(token);
    if (token) {
      const response = await axios.post(
        url + "/api/cart/add",
        {
          foodId,
          quantity,
          price,
          addonIds: selectedAddons,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        loadCartData(token);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { cartItemId: itemId },
        { headers: { token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;

    if (cartItems.length > 0) {
      for (const item of cartItems) {
        let addonTotalPrice = 0;
        for (const addon of item.addons) {
          addonTotalPrice += parseFloat(addon.price);
        }
        totalAmount +=
          addonTotalPrice + parseFloat(item.food.price) * item.quantity;
      }
    }

    //totalAmount = totalAmount * 0.13 + totalAmount;
    return totalAmount;
  };

  const fetchFoodList = async () => {
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

      setFoodList(newFoodList);
    }
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );

    if (response.data.success) {
      setCartItems(response.data.data);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();

      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
