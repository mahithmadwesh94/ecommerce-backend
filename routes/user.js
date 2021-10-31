const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const User = require("../models/User");

const router = require("express").Router();

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedUser);

    } catch (err) {
        res.status(500).json(err);
    }
})

//DELETE 
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json("User has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
})


//GET USER 
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(...others)

    } catch (err) {
        res.status(500).json(err);
    }
})

//GET ALL USERS 
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const user = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
        res.status(200).json(user)

    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router