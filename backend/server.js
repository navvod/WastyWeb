const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser"); //importing neccessary files
require("dotenv").config();
const cloudinary = require('cloudinary').v2;


const app = express(); //creating app

// create a server
const PORT = process.env.PORT || 9500;

//connect server
app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});

//creating a database
const URL = process.env.MONGODB_URL;
mongoose.connect(URL);

//connecting database
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB connection success");
});

//json format
app.use(cors());
app.use(bodyParser.json());

//router path user
const userRouter = require("./routes/userRoutes.js");
app.use("/user", userRouter);


//router path Route manage
const routeRouter = require("./routes/routeRoutes.js");
app.use("/route", routeRouter);


//router path Route manage
const wasteRouter = require("./routes/wasteCollectionRoutes.js");
app.use("/waste", wasteRouter);


app.use(express.urlencoded({ extended: true }));

app.use(
  express.json({
    limit: "20mb",
  })
);

app.post("/upload", async (req, res, next) => {
  try {
    const image_url = req.body.image_url;

    const cloudinary_res = await cloudinary.uploader.upload(image_url, {
      folder: "/images",
    });

    const imageUrl = uploadResult.secure_url;
    console.log(imageUrl);

    console.log(cloudinary_res);
  } catch (err) {
    console.log(err);
  }
});

