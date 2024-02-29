const Brand = require("../models/brandModel");
const validateMongodbId = require("../utils/validateMongodbId");

const createBrand = async (req, res) => {
  const newbrand = await Brand.create(req.body);
  res.json(newbrand);
};
const updateBrand = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(updatedBrand);
};
const deleteBrand = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const deletedBrand = await Brand.findByIdAndDelete(id);
  res.json(deletedBrand);
};
const getaBrand = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const getBrand = await Brand.findByIdAndDelete(id);
  res.json(getBrand);
};
const getAllBrand = async (req, res) => {
  const allBrand = await Brand.find();
  res.json(allBrand);
};

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getaBrand,
  getAllBrand,
};
