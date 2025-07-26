const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user;
    console.log(newReview);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review added");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview = async(req,res)=>{
    let { id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : { review : reviewId}});
    let del = await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    console.log(reviewId , id,del);
    res.redirect(`/listings/${id}`);
};