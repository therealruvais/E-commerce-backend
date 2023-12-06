const Category = require('../models/prodCategoryModel')
const validateMongodbId = require("../utils/validateMongodbId");

const createCategory = async (req, res) => {
    const category = await Category.create(req.body)
    res.json(category)
}
const updateCategory = async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true })
    res.json(updatedCategory)
}
const deleteCategory = async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    const deletedCategory = await Category.findByIdAndDelete(id)
    res.json(deletedCategory);
}
const getaCategory = async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    const getCategory = await Category.findByIdAndDelete(id)
    res.json(getCategory);
}
const getAllCategory = async (req, res) => {
    const allCategory = await Category.find()
    res.json(allCategory);
}



module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getaCategory,
  getAllCategory,
};