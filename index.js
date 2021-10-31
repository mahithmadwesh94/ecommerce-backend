const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/products")
const cartRoute = require("./routes/cart")
const cors = require("cors");

mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connection established')).catch(err => console.log(err))
port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${port}`)
})