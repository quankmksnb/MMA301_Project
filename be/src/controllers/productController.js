import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      stock,
      seller: req.user.id,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
