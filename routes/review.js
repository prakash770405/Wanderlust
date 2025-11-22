const express = require("express");
const router=express.Router({mergeParams:true});
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js"); // we use joi as a schema validator for our review database 
const Review = require("../models/review.js") 



const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);  //using joi for creating new listing and validates its schema if all data is filled or not
  if (error) {
    throw new ExpressError(400, error.message);
  }
  else {
    next();
  }
};

//------------------------------------- create new reviews route
router.post("/", validateReview,wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
  let newReview = new Review(req.body.review)
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","New Review Created");
  res.redirect(`/listings/${listing._id}`);
}));

//------------------------------------------delete review route
router.get("/:reviewId/delete", async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {    // Remove review reference from listing schema
        $pull: { reviews: reviewId }
    });
    await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
});


module.exports=router;