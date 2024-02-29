const Enquiry = require("../models/enqModel");
const validateMongodbId = require("../utils/validateMongodbId");

const createEnquiry = async (req, res) => {
  const newEnquiry = await Enquiry.create(req.body);
  res.json(newEnquiry);
};
const updateEnquiry = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(updatedEnquiry);
};
const deleteEnquiry = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
  res.json(deletedEnquiry);
};
const getaEnquiry = async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const getEnquiry = await Enquiry.findByIdAndDelete(id);
  res.json(getEnquiry);
};
const getAllEnquiry = async (req, res) => {
  const allEnquiry = await Enquiry.find();
  res.json(allEnquiry);
};

module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getaEnquiry,
  getAllEnquiry,
};
