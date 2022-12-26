const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const HttpError = require("./models/http-errors");
const placesRoute = require("./routes/places-routes");
const userRoute = require("./routes/user-routes");
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(__dirname + "/uploads/images"));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
  });
app.use("/api/places",placesRoute);

app.use("/api/users", userRoute);

app.use((req,res,next) =>{
    const error = new HttpError("Could not find path", 404);
    throw error;
});

app.use((error,req,res,next) => {
    if (req.file){
        fs.unlink(req.file.path, err =>{
            console.log(err);
        });
    }
    if (res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || "Unknow error has occured"});
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.meczrka.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`).then(()=> 
{app.listen(process.env.PORT || 5000);}).catch(error => {
    console.log(error);
});


