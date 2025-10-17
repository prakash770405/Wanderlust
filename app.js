const express= require("express")
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")      //fetching listing schema for database..
const Review=require("./models/review.js")       //fetching review schema for database..
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const review = require("./models/review.js");
const app= express();

app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set(path.join(__dirname,"views"));

main()
.then(()=>{console.log("connected to database");})
.catch((err) => {console.log(err);});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.listen(8080,(req,res)=>{
    console.log("app is listening on port 8080");
})

app.get("/",(req,res)=>{
    res.send("working");
})


//---------------------------data inserting
// app.get("/testlisting",async (req,res)=>{
//     let sampleListing= new Listing({
//         title:"hellobeach",
//         description:"by the beach",
//         price:1200,
//         location:"goa",
//         country:"india",
//     });
//      await sampleListing.save()
//      console.log("saved");
//      res.send("successful");
//     .then(()=>{console.log("saved");})
//     .catch((err)=>{console.log(err);})
// })

//----------------------------------------new listing
app.get("/listings/new",(req,res)=>{
  res.render("./listings/new.ejs");
})

app.post("/listings",async(req,res)=>{
 
  // let {title,description,price,country,location}=req.body;  //------pahla tarika req ki body se data lenae ka
  // console.log(title,description,price,country,location);
  //let listing=req.body.listing; //-------dossara tarika ye hai ki form k name ko variable k sath likh do
  //console.log(listing);


  const newListing= new Listing(req.body.listing); //<------kuch iss tarah------>
  await newListing.save();
  res.redirect("/listings");

})

//------------------------------------------------listing index route
app.get("/listings",async(req,res)=>{
const allListing= await Listing.find({});
res.render("./listings/index.ejs",{allListing});
})
//----------------------------------------------show route
app.get("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id).populate("reviews");
res.render("./listings/show.ejs",{listing});
})

//---------------------------------------------edit route

app.get("/listings/:id/edit",async(req,res)=>{
   let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("./listings/edit.ejs",{listing});
})

app.put("/listings/:id" ,async (req,res)=>{
let {id}=req.params;
  
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`);
})

//-----------------------------------delete route
app.delete("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
})

//-------------------------------------reviews route
app.post("/listings/:id/reviews",async(req,res)=>{
  let {id}=req.params;
 let listing= await Listing.findById(id)
 let newReview=new Review(req.body.review)
 listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
})