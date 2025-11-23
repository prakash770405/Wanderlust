const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema  } = require("./schema.js"); // we use joi as a schema validator for our listing database

module.exports.isLoggedIn=(req,res,next)=>{
   if(!req.isAuthenticated())
    {
      req.flash("error","Please Login First!!");  
       return res.redirect("/login");
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) //prevent from hoppscotch to take input
  {
    req.flash("error", "you don't have permission to modify this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}


module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);  //using joi for creating new listing and validates its schema if all data is filled or not
  if (error) {
    throw new ExpressError(400, error.message);
  }
  else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);  //using joi for creating new listing and validates its schema if all data is filled or not
  if (error) {
    throw new ExpressError(400, error.message);
  }
  else {
    next();
  }
};


module.exports.isReviewAuthor=async(req,res,next)=>{
  let { id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) //prevent from hoppscotch to take input
  {
    req.flash("error", "you don't have permission to delete this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}