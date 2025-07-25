const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose); //adds username and password fields to the schema
module.exports = mongoose.model("User", UserSchema); //exports the model so that it can be used in other files
// Note: passportLocalMongoose automatically adds username and password fields to the schema, so we don't need to define them explicitly.
// It also provides methods for authentication, such as register, authenticate, and serialize/deserialize user