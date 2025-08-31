const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")
const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    price: Number,
    location: String,
    image:{
    url: String,
    // url:{
    //     type: String,
    //     default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCG5Kb4ojjpylCIPM5rsX-AwRxhGStXkWCHwOf0hMji25EYtrBPKRbZa8&s",
    //     set: (v)=> v===""? "https://www.adanirealty.com/-/media/project/realty/blogs/types-of-residential-properties.ashx":v
    //     },
    filename: String,
    },
    country: String,

    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});

// This is done so that when the listing is deleted the reviews related to the listing will also get deleted
// Its a middle ware which enables when the findoneandupdate query calls
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}})
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;