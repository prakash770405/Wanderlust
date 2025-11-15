const express = require("express")
const mongoose = require("mongoose");
const app = express();
const Listing = require("./models/listing.js")      //fetching listing schema for database..
const Review = require("./models/review.js")       //fetching review schema for database..
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

main()
  .then(() => { console.log("connected to database"); })
  .catch((err) => { console.log(err); });

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/", (req, res) => {
  res.send("working");
});

//----------------------------------------new listing (create new list)
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

app.post("/listings", wrapAsync(async (req, res, next) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listings");
  }
  const newListing = new Listing(req.body.listing); //<------kuch iss tarah------>
  await newListing.save();
  res.redirect("/listings");
}));

//------------------------------------------------listing index route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render("./listings/index.ejs", { allListing });
}));
//----------------------------------------------show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("./listings/show.ejs", { listing });
}));

//---------------------------------------------edit route

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
}));

//---------------------------------------------update route

app.put("/listings/:id", wrapAsync(async (req, res) => {
   if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listings");
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//-----------------------------------delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

//------------------------------------- create new reviews route
app.post("/listings/:id/reviews", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
  let newReview = new Review(req.body.review)
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found")); // for random undefined routes its says page not found
});



app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;//if something unknown happens than the exact errror will be displayed
  res.status(statusCode).render("./listings/error.ejs", { message});//like validation error failed due to casting
  // res.status(statusCode).send(message);
});


app.listen(8080, (req, res) => {
  console.log(`app is listening on port 8080`);
});
