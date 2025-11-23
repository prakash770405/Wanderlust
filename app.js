const express = require("express")
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");  // express router for listings
const reviewRouter = require("./routes/review.js");    // express router for reviews
const userRouter=require("./routes/user.js");

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

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");// success flash
  res.locals.error = req.flash("error");//error flash
  res.locals.currUser=req.user;
  next();
})


app.get("/", (req, res) => {
  res.send("working");
});


app.use("/listings", listingRouter)      // express router matches the routes for listing
app.use("/listings/:id/reviews", reviewRouter)  // express router matches the routes for reviews listings
app.use("/", userRouter)  // express router matches the routes for users credentials


app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found")); // for random undefined routes its says page not found
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;//if something unknown happens than the exact errror will be displayed
  res.status(statusCode).render("./listings/error.ejs", { message });//like validation error failed due to casting
  // res.status(statusCode).send(message);
});

app.listen(8080, (req, res) => {
  console.log(`app is listening on port 8080`);
});
