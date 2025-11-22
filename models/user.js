const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email: { type: String, required: true }
})

userSchema.plugin(passportLocalMongoose);//it automatically defines the user,password and hash,salt in schema so we don't need to define it

module.exports=mongoose.model("User",userSchema);
