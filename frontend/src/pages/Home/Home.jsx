import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import OffersBar from "../../components/OffersBar/OffersBar";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";

const Home = ({ url }) => {
  const [category, setCategory] = useState("ALL");

  return (
    <div>
      <Header />
      <OffersBar url={url} />
      <ExploreMenu category={category} setCategory={setCategory} url={url} />
      <FoodDisplay category={category} />
      {/*<AppDownload />*/}
    </div>
  );
};

export default Home;
