import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const url = "http://localhost:4000";
  const [cartId, setCartId] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [promoCodeData, setPromoCodeData] = useState([]);

  const addToCart = async (foodId, price, quantity, selectedAddons) => {
    let newCartId = cartId;

    // Create new cart if empty
    if (cartItems.length === 0) {
      const cartIdResponse = await axios.post(url + "/api/cart/getId");
      if (cartIdResponse.data.success) {
        newCartId = cartIdResponse.data.data;
        localStorage.setItem("cartId", cartId);
        setCartId(newCartId); // still update state
      }
    }

    console.log(newCartId);
    // Use the local newCartId (guaranteed to be correct)
    if (newCartId !== "") {
      const response = await axios.post(url + "/api/cart/add", {
        cartId: newCartId,
        foodId,
        quantity,
        price,
        addonIds: selectedAddons,
      });

      console.log(response.data.success);
      if (response.data.success) {
        loadCartData(newCartId);
      } else {
        console.error("Add to cart failed:", response.data.message);
      }
    } else {
      console.error("Cart ID is still empty");
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (cartId !== "") {
      await axios.post(url + "/api/cart/remove", {
        cartItemId: itemId,
        cartId: cartId,
      });
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

    // ✅ Apply promo BEFORE calculating HST
    if (promoCodeData && promoCodeData.discountType) {
      if (promoCodeData.discountType === "percent") {
        discountAmount = totalBeforeTax * (promoCodeData.discountAmount / 100);
        totalBeforeTax -= discountAmount;
      } else {
        discountAmount = promoCodeData.discountAmount;
        totalBeforeTax -= discountAmount;
      }
    }

    // ✅ Now calculate HST on the discounted subtotal
    let hstAmount = totalBeforeTax * hstRate;
    let totalWithTax = totalBeforeTax + hstAmount;

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
      /*
      const ordersResponse = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      let filterData = ordersResponse.data.data.filter(
        (x) => x.promoCode === findCode.disCode
      );*/

      let promoMsg = "";
      const today = new Date();
      const start = new Date(findCode.startDate);
      const end = new Date(findCode.endDate);

      if (findCode) {
        if (today < start) {
          promoMsg = "Promo code not yet active!";
        } else if (today > end) {
          promoMsg = "Promo code expired!";
        } /* else if (filterData.length >= findCode.limitPerUser) {
          promoMsg = "You reached the promo code usage limit!";
        }*/ else {
          setPromoCodeData(findCode); // ✅ correct syntax
          (promoMsg = "Promo applied"), findCode;
        }
      } else {
        setPromoCodeData({}); // clear if invalid
        promoMsg = "Invalid promo code!";
      }

      return promoMsg;
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

  const loadCartData = async (id) => {
    if (cartId !== "") {
      const response = await axios.post(url + "/api/cart/get", {
        cartId: cartId,
      });

      if (response.data.success) {
        setCartItems(response.data.data);
      }
    } else {
      const response = await axios.post(url + "/api/cart/get", { cartId: id });

      if (response.data.success) {
        setCartItems(response.data.data);
      }
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();

      if (cartId !== "") {
        await loadCartData(cartId);
      }
    }
    loadData(cartId);
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
    cartId,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
