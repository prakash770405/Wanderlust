const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js")      //fetching listing schema for database..
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


//----------------------------------------new listing (create new list)
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});

router.post("/", validateListing, wrapAsync(async (req, res, next) => {

  const newListing = new Listing(req.body.listing); //<------kuch iss tarah------>
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created Successfully");
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
  const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
  res.render("./listings/show.ejs", { listing });
}));

//---------------------------------------------edit route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
}));

//---------------------------------------------update route

router.put("/:id", validateListing, isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!!");
  res.redirect(`/listings/${id}`);
}));

//-----------------------------------delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  await Review.deleteMany({ _id: { $in: listing.reviews } });
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted Successfully");
  res.redirect("/listings");
}));

module.exports = router;