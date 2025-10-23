import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [promoCodeData, setPromoCodeData] = useState([]);

  const addToCart = async (foodId, price, quantity, selectedAddons) => {
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
    let subtotal = 0;
    let deliveryFee = 2;
    let hstRate = 13 / 100;
    let discountAmount = 0;

    if (cartItems.length > 0) {
      for (const item of cartItems) {
        let addonTotalPrice = 0;
        for (const addon of item.addons) {
          addonTotalPrice += parseFloat(addon.price);
        }
        subtotal +=
          (parseFloat(item.food.price) + addonTotalPrice) * item.quantity;
      }
    }

    let totalBeforeTax = subtotal + deliveryFee;
    let hstAmount = totalBeforeTax * hstRate;
    let totalWithTax = totalBeforeTax + hstAmount;

    // Apply promo
    if (promoCodeData && promoCodeData.discountType) {
      if (promoCodeData.discountType === "percent") {
        discountAmount = totalWithTax * (promoCodeData.discountAmount / 100);
        totalWithTax -= discountAmount;
      } else {
        discountAmount = promoCodeData.discountAmount;
        totalWithTax -= discountAmount;
      }
    }

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      deliveryFee,
      hstAmount: Math.round(hstAmount * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      total: Math.round(totalWithTax * 100) / 100,
    };
  };

  const getPromoCode = async (code) => {
    try {
      const response = await axios.get(url + "/api/offer/all");
      const findCode = response.data.data.find((c) => c.disCode === code);

      if (findCode) {
        setPromoCodeData(findCode); // ✅ correct syntax
        console.log("Promo applied:", findCode);
      } else {
        setPromoCodeData({}); // clear if invalid
        console.warn("Invalid promo code");
      }
    } catch (error) {
      console.error("Error fetching promo codes:", error);
    }
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
    getPromoCode,
    promoCodeData,
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
