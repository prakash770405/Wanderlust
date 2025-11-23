const mongoose=require("mongoose");
const user = require("./user");
const Schema=mongoose.Schema;

const listingSchema= new Schema({
title:{
    type: String,
    required:true,
    },

description: String,

image:{ 
        type: String,
        default: "https://images.unsplash.com/photo-1546587348-d12660c30c50?fm=jpg&q=60&w=3000",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1546587348-d12660c30c50?fm=jpg&q=60&w=3000" : v,
},
price:Number,
location:String,
country:String,
reviews:[
    {
    type:Schema.Types.ObjectId,
    ref:"Review",
    }
],
owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
}
})

let Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;

