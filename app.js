if(process.env.NODE_ENV != "producation"){
    require('dotenv').config();
}

// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override'); //requires the method-override library
const ejsMate = require("ejs-mate"); //ejs-mate is a library that allows us to use layout files with EJS
const Expresserror = require("./utils/Expresserror.js")
const session = require("express-session"); //session management middleware for express
const flash = require("connect-flash"); //flash messages middleware for express
const passport = require("passport"); //passport is an authentication middleware for express
const LocalStrategy = require("passport-local"); //local strategy for passport
const User = require("./models/user.js"); //user model for authentication


const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate) //use the ejs-mate package 
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method')); //allows us to use HTTP verbs such as PUT or DELETE in places where the client doesn't support it

main().then(()=>{
    console.log("connected to mongodb successfully")
}).catch((err)=>{
    console.log(err)
})

const sessionoptions = {
    secret: "mysecret",
    resave: false,
    saveUninitialized: true}


app.get("/",(req,res)=>{
    res.send("Hello Everyone")
})


app.use(session(sessionoptions)); //using the session middleware with the options defined above
app.use(flash()); //using the flash middleware

app.use(passport.initialize()); //initializing passport
app.use(passport.session()); //using passport session middleware
passport.use(new LocalStrategy(User.authenticate()));//using the local strategy for authentication

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
// app.get("/demouser",async (req,res)=>{
//     let fakeuser = new User({
//         email: "himakshimanmode24@gmail.com",
//         username: "himakshimanmode",
//     });

//     let registeredUser = await User.register(fakeuser, "123abcd");
//     res.send(registeredUser);
// });

app.use("/listings",listingRouter); //accessing all the routes from the "listing.js"
app.use('/listings/:id/reviews',reviewsRouter); //accessing all the routes from the "reviews.js"
app.use("/",userRouter);

app.all(/.*/,(req,res,next)=>{
    next(new Expresserror(404,"Page not found"))
});

app.use((err,req,res,next)=>{
    let {statuscode=500,message="Something went wrong again"}=err;
    res.status(statuscode).send(message)
});

app.listen(8080, ()=>{
    console.log("Server in running properly");
})


