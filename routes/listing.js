const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { isLoggedIn , isOwner , validateListing } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

//Root Route
router.get("/",listingController.Root);

//Index Route
router.get("/listings", wrapAsync(listingController.Index));

//New Route
router.get("/listings/new",isLoggedIn,(listingController.renderNewForm));

//Create Route
router.post("/listings",isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));

//Search Route
router.get("/listings/search" , wrapAsync(listingController.searchListing));

//Show Route
router.get("/listings/:id",wrapAsync(listingController.showListing));

//Edit Route
router.get("/listings/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//Update Route
router.put("/listings/:id",upload.single("listing[image]"),validateListing,isLoggedIn,isOwner, wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/listings/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports = router;