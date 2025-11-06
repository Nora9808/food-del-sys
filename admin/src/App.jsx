import React from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import { Routes, Route, useLocation } from "react-router-dom";
import Add from "./pages/Add/Add.jsx";
import List from "./pages/List/List.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import Category from "./pages/Category/Category.jsx";
import Offer from "./pages/Offer/Offer.jsx";
import OfferList from "./pages/OfferList/OfferList.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";

const App = () => {
  const url = "http://localhost:4000";
  const location = useLocation();

  // Hide Navbar/Sidebar on login page
  const hideLayout = location.pathname === "/";

  return (
    <div>
      <ToastContainer />
      {!hideLayout && <Navbar />}
      {!hideLayout && <hr />}

      {!hideLayout && localStorage.getItem("token") ? (
        <div className="app-content">
          <Sidebar />
          <Routes>
            <Route
              path="/list"
              element={
                <ProtectedRoute>
                  <List url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <Add url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/category"
              element={
                <ProtectedRoute>
                  <Category url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offer"
              element={
                <ProtectedRoute>
                  <Offer url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offerList"
              element={
                <ProtectedRoute>
                  <OfferList url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders url={url} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login url={url} />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
