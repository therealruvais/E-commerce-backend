require("dotenv").config();
require("express-async-errors");
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const morgan = require('morgan')

const connectDB = require("./config/connectDB");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute")
const blogRoute = require("./routes/blogRoute")
const pCategoryRoute = require('./routes/pCategoryRoute')
const blogCategoryRoute = require('./routes/blogCatRoute')
const brandRouter = require('./routes/brandRoute')
const couponRoute = require('./routes/couponRoute')

const express = require("express");
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", authRoute);
app.use("/api/product", productRoute);
app.use("/api/blog", blogRoute)
app.use("/api/pcategory", pCategoryRoute);
app.use("/api/blogcategory", blogCategoryRoute);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRoute);

app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("hello");
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`port is running at ${port}`);
    });
  } catch (error) {
    console.log(`somethings wrong with the connection`, error);
  }
};
start();
