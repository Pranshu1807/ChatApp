const mongoose = require("mongoose");
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.in2wauv.mongodb.net/?retryWrites=true&w=majority`,
  () => {
    console.log("DB Connected");
  }
);
