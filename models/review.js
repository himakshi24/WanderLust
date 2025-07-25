const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewschema = new Schema({
    comment : String,
    rating :{
        type: Number,
        min:1,
        max:5
    },
    CreatedAt:{
        type: Date,
        default: Date.now()
    }
})

const review = mongoose.model("review",reviewschema);
module.exports=review;