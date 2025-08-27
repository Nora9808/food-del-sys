import mongoose from "mongoose";

const subItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
});

const subItemModel =
  mongoose.models.subItem || mongoose.model("subItem", subItemSchema);

export default subItemModel;
