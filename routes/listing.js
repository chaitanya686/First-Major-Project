const express = require('express');
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync");
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner,validateListing } = require('../middleware.js');

const listingController=require('../controllers/listing');
const multer  = require('multer');
const{ storage }=require('../cloudConfig.js');
const upload = multer({ storage });

router.route('/')
.get(wrapAsync(listingController.index)) // INDEX WALA ROUTE
.post(isLoggedIn,  upload.single('imageUpload'), validateListing, wrapAsync(listingController.createNewListing)); // CREATE NEW POST WALA ROUTE


// CREATE NEW GET WALA ROUTE --isko SHOW wale se pehele likhna hai nahi toh vo 'new' ko hi id samaj lega.
router.get('/new', isLoggedIn, listingController.renderNewForm);

router.route('/:id')
.get(wrapAsync(listingController.showListing)) //SHOW WALA ROUTE
.put(isLoggedIn,isOwner, upload.single('Listing[imageUpload]'), validateListing, wrapAsync(listingController.updateListing)) //EDIT PUT WALA ROUTE -Update Wala
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing)); //DELETE WALA ROUTE

//EDIT GET WALA ROUTE
router.get('/:id/edit', isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
