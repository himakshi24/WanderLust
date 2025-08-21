const express = require("express");
// const review = require("../models/review");
const router = express.Router({mergeParams: true}); //mergeParams is used to merge the parameters from the parent route
const wrapAsync = require("../utils/wrapAsync.js")
const Expresserror = require("../utils/Expresserror.js")
const Review = require("../models/review.js"); // Make sure this is at the top
// const methodOverride = require('method-override'); //requires the method-override library
const Listing = require("../models/listing.js") //indicztion error not a problem
// At the top of routes/reviews.js
const { isLoggedIn} = require('../middleware');


// const validateReview = (req, res, next) => {
//     let{error} = reviewSchema.validate(req.body); //validating the review using the reviewSchema
//     if(error){
//         let msg = error.details.map((el)=> el.message).join(","); //joining the error messages
//         throw new Expresserror(msg,400); //throwing an error with the message and status code 400
//     } else {
//         next(); //if there is no error, move to the next middleware
//     }}
// // Review Route

const reviewController = require("../controllers/reviews.js");


// POST Request
router.post("/", 
    isLoggedIn,
    wrapAsync(reviewController.createReview)
);

// Delete Review Route
router.delete(
    "/:reviewID",
    isLoggedIn,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;







  