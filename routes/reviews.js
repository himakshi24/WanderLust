const express = require("express");
// const review = require("../models/review");
const router = express.Router({mergeParams: true}); //mergeParams is used to merge the parameters from the parent route
const wrapAsync = require("../utils/wrapAsync.js")
const Expresserror = require("../utils/Expresserror.js")
const Review = require("../models/review.js"); // Make sure this is at the top
// const methodOverride = require('method-override'); //requires the method-override library
const Listing = require("../models/listing.js") //indicztion error not a problem

const validateReview = (req, res, next) => {
    let{error} = reviewSchema.validate(req.body); //validating the review using the reviewSchema
    if(error){
        let msg = error.details.map((el)=> el.message).join(","); //joining the error messages
        throw new Expresserror(msg,400); //throwing an error with the message and status code 400
    } else {
        next(); //if there is no error, move to the next middleware
    }}
// Review Route



// POST Request
router.post("/", async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created Successfully");
    res.redirect(`/listings/${listing._id}`);
});

// Delete Review Route
router.delete("/:reviewID",wrapAsync(async (req,res)=>{
    let {id,reviewID}=req.params;

    await Listing.findByIdAndUpdate(id,{ $pull: { reviews: reviewID}}) //pull query to delete the review from the review array in the database
    await Review.findByIdAndDelete(reviewID);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;