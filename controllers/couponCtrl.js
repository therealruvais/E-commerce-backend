const Coupon = require('../models/couponModel')
const validateMongodbId = require("../utils/validateMongodbId");


const createCoupon = async (req,res) => {
    const newCoupon = await Coupon.create(req.body)
    res.json(newCoupon)
}

const getAllCoupon = async (req,res) => {
    const coupons = await Coupon.find()
    res.json(coupons)
}

const updateCoupon = async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    const updatedCoupons = await Coupon.findByIdAndUpdate(id,req.body,{new:true})
    res.json(updatedCoupons);
}

const deleteCoupon = async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    const deleteCoupons = await Coupon.findByIdAndDelete(id)
    res.json(deleteCoupons);
}

module.exports = { createCoupon, getAllCoupon, updateCoupon, deleteCoupon };