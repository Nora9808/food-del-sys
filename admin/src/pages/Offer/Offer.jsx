import "./Offer.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Offer = ({ url }) => {
  const [data, setData] = useState({
    name: "",
    startDate: new Date(),
    endDate: new Date(),
    discountType: "",
    discountAmount: 0,
    disCode: "",
    limitPerUser: 0,
    buyNum: 0,
    getNum: 0,
  });

  const onChnageHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const response = await axios.post(`${url}/api/offer/add`, data);

    toast.success(response.data.message);

    if (response.data.success) {
      setData({
        name: "",
        startDate: new Date(),
        endDate: new Date(),
        discountType: "",
        discountAmount: 0,
        disCode: "",
        limitPerUser: 0,
        buyNum: 0,
        getNum: 0,
      });
    }
  };

  return (
    <div className="offer">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-offer-name flex-col">
          <p>Offer Name</p>
          <input
            onChange={onChnageHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="type here"
          />
        </div>

        <div className="offer-type flex-col">
          <p>Offer Type</p>
          <select
            onChange={onChnageHandler}
            name="discountType"
            defaultValue=""
          >
            <option value="" disabled>
              -- Select --
            </option>
            <option value="percent">Percent</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>

        <div className="add-offer-amount flex-col">
          <p>Offer Amount</p>
          <input
            onChange={onChnageHandler}
            value={data.discountAmount}
            name="discountAmount"
            placeholder="type here"
            type="number"
          />
        </div>

        <div className="add-offer-code flex-col">
          <p>Offer Code</p>
          <input
            onChange={onChnageHandler}
            value={data.disCode}
            name="disCode"
            placeholder="type here"
            type="text"
          />
        </div>

        <div className="add-offer-limit flex-col">
          <p>Limit Per User</p>
          <input
            onChange={onChnageHandler}
            value={data.limitPerUser}
            name="limitPerUser"
            placeholder="type here"
            type="number"
          />
        </div>

        <div className="add-offer-start flex-col">
          <p>Start Date & Time</p>
          <input
            onChange={onChnageHandler}
            value={data.startDate}
            name="startDate"
            type="datetime-local"
          />
        </div>

        <div className="add-offer-end flex-col">
          <p>End Date & Time</p>
          <input
            onChange={onChnageHandler}
            value={data.endDate}
            name="endDate"
            type="datetime-local"
          />
        </div>

        <button type="submit" className="add-btn">
          ADD OFFER
        </button>
      </form>
    </div>
  );
};

export default Offer;
