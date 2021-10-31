const router = require("express").Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const Product = require("../models/Product");


//create
router.post("/", verifyTokenAndAdmin, async (req, res) => {

    const newProducts = new Product(req.body);
    try {
        const savedProduct = await newProducts.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err)
    }
})


//update
router.put("/", verifyTokenAndAdmin, async (req, res) => {


    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err)
    }
})


//DELETE 
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json("Product has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
})


//GET PRODUCT 
router.get("/find/:id", async (req, res) => {
    try {
        const products = await Product.findById(req.params.id);

        res.status(200).json(products)

    } catch (err) {
        res.status(500).json(err);
    }
})


//GET ALL PRODUCTS 
router.get("/", async (req, res) => {
    const qNew = req.query.new
    const qCat = req.query.category
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCat) {
            products = await Product.find({ categories: { $in: [qCat] } })
        } else {
            products = await Product.find()
        }
        res.status(200).json(products)

    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router