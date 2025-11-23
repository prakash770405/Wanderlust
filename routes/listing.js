const express = require("express");
const router=express.Router();

const Listing = require("../models/listing.js")      //fetching listing schema for database..
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js"); // we use joi as a schema validator for our listing database 
const Review = require("../models/review.js"); 
const { isLoggedIn } = require("../middleware.js");



const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);  //using joi for creating new listing and validates its schema if all data is filled or not
  if (error) {
    throw new ExpressError(400, error.message);
  }
  else {
    next();
  }
};


//----------------------------------------new listing (create new list)
router.get("/new", isLoggedIn,(req, res) => {
  res.render("./listings/new.ejs");
});

router.post("/",validateListing ,wrapAsync(async (req, res, next) => {

  const newListing = new Listing(req.body.listing); //<------kuch iss tarah------>
  await newListing.save();
  req.flash("success","New Listing Created Successfully");
  res.redirect("/listings");
}));

//------------------------------------------------listing index route
router.get("/", wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render("./listings/index.ejs", { allListing });
}));
//----------------------------------------------show route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("./listings/show.ejs", { listing });
}));

//---------------------------------------------edit route

router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
}));

//---------------------------------------------update route

router.put("/:id",validateListing ,isLoggedIn,wrapAsync(async (req, res) => {

  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success","Listing Updated!!");
  res.redirect(`/listings/${id}`);
}));

//-----------------------------------delete route
router.delete("/:id", isLoggedIn,wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  await Review.deleteMany({_id: { $in: listing.reviews} });
  await Listing.findByIdAndDelete(id);
   req.flash("success","Listing deleted Successfully");
  res.redirect("/listings");
}));

module.exports=router;