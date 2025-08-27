import categoryModel from "../models/categoryModel.js";

// add new category
const addCategory = async (req, res) => {
  const category = new categoryModel({
    name: req.body.name,
    type: req.body.type,
  });

  try {
    await category.save();
    res.json({ success: true, message: "Category Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// list all categories
const listCategory = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.json({ success: true, data: category });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove category
const removeCategory = async (req, res) => {
  try {
    await categoryModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Category Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addCategory, listCategory, removeCategory };
