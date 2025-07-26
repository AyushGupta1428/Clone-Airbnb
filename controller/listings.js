const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.Root = (req,res)=>{
    res.render("listings/root.ejs");
};

module.exports.Index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
};

module.exports.renderNewForm = (req,res)=>{

    res.render("listings/new.ejs");
};

module.exports.createListing = async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url , filename };
    newListing.geometry = response.body.features[0].geometry;
    let result = await newListing.save();
    console.log(result);
    req.flash("success"," New Listing created");
    res.redirect("/listings");
};

module.exports.searchListing = async(req,res) =>{
    let list = [];
    const allListings = await Listing.find({});
    for(listing of allListings){
        if(req.query.search.toLowerCase()===listing.title.toLowerCase()||req.query.search.toLowerCase()===listing.location.toLowerCase()||req.query.search.toLowerCase()===listing.country.toLowerCase()){
            list.push(listing);
        }
        
    }
    res.render("listings/search.ejs", { list });
   
};

module.exports.showListing = async (req,res)=>{
    let { id } = req.params;
        const list = await Listing.findById(id).populate("owner").populate({ path : "review", populate : { path : "author" },});
    if(!list){
        req.flash("error","Listing not Found!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ list });
};

module.exports.renderEditForm = async (req,res)=>{
    let { id } = req.params;
    const list = await Listing.findById(id);
    if(!list){
        req.flash("error","Listing not Found!");
        res.redirect("/listings");
    }
    let originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{ list , originalImageUrl });
};

module.exports.updateListing = async (req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url , filename };
        await listing.save();
    }   
   
    req.flash("success"," Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let { id } = req.params;
    let DeletedListing = await Listing.findByIdAndDelete(id);
    console.log(DeletedListing);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");

};