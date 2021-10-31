const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

//REGISTER
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,

        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});


//LOGIN
router.post("/login", async (req, res) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });

        const validPassword = await bcrypt.compare(req.body.password, existingUser.password);

        !validPassword && res.status(400).json("Wrong Credentials!!!");

        const accessToken = jwt.sign({
            id: existingUser.id, isAdmin: existingUser.isAdmin

        }, process.env.JWT_SEC, { expiresIn: "3d" })

        const { password, ...others } = existingUser._doc;
        res.status(200).json({ ...others, accessToken })

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

module.exports = router