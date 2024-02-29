
const Color = require("../models/colorModel");
const validateMongodbId = require("../utils/validateMongodbId");

const createColor = async (req, res) => {
  const newColor = await Color.create(req.body);
  res.json(newColor);
};
const updateColor = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(updatedColor);
};
const deleteColor = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const deletedColor = await Color.findByIdAndDelete(id);
  res.json(deletedColor);
};
const getaColor = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const getColor = await Color.findByIdAndDelete(id);
  res.json(getColor);
};
const getAllColor = async (req, res) => {
  const allColor = await Color.find();
  res.json(allColor);
};

module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getaColor,
  getAllColor,
};

