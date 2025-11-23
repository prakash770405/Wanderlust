const express = require("express");
const router=express.Router({mergeParams:true});
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const Review = require("../models/review.js") 


//------------------------------------- create new reviews route
router.post("/",isLoggedIn ,validateReview,wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
  let newReview = new Review(req.body.review)
  newReview.author=req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success","New Review Created");
  res.redirect(`/listings/${listing._id}`);
}));

//------------------------------------------delete review route
router.get("/:reviewId/delete",isLoggedIn,isReviewAuthor,wrapAsync( async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {    // Remove review reference from listing schema
        $pull: { reviews: reviewId }
    });
    await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}));


module.exports=router;