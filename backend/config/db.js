import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://greatstack:vHk12VWa5jb6AFkK@cluster0.dxuhcne.mongodb.net/food-del"
    )
    .then(() => console.log("DB Connected"));
};
