if(process.env.NODE_ENV != "production"){
    require('dotenv').config()

}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const userRoute = require("./routes/user.js");

app.set("view engine","ejs");
app.use(express.urlencoded({extended : true}));
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
main()  
    .then(() =>{
        console.log("Connected to DB");
    })
    .catch(err => {
        console.log(err);
    });
async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600 ,
});

store.on("error" , ()=>{
    console.log("Error in Mongo Session Store", err);
})

const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
}

app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/",userRoute);

app.use("/",listingRoute);

app.use("/listings/:id/reviews", reviewRoute); 

app.all('/{*any}',(req,res,next)=>{
    next( new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let {status = 500 , message = "Some Error Occured"} = err;
    res.status(status).render("listings/error.ejs",{ message });
    console.log(err);
});

app.listen(8080,()=>{
    console.log("app is listening to port 8080");
});