const Listing = require('../models/listing');

module.exports.index = async(req, res) => {
   const allListings= await Listing.find({});
   //console.log(allListings);
   res.render('listings/index',{ allListings});       
};

module.exports.renderNewForm = (req,res)=>{
    res.render('listings/new');
};

module.exports.createNewListing = async(req,res) => { // pahele listing validate ki jayegi badh me baki kaam..
    
    let imageurl = req.file ? req.file.path : "";
    let imagefilename = req.file ? req.file.filename : "";
    //console.log("url: ", url, " filename: ", filename);
    const newListing = new Listing(req.body.Listing);
    newListing.owner=req.user._id; //setting the owner of the listing to the currently logged in user.
    newListing.image={url: req.body.Listing.image.url}; // Setting the image url from the form input
    newListing.imageUpload = {
        imageurl, // will be "" if no file uploaded
        imagefilename
    }; 
    await newListing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect('/listings');
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
    if (!listing) {
        req.flash('error', 'This listing does not exist!');
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
};

module.exports.renderEditForm = async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error', 'This listing does not exist!');
        return res.redirect('/listings');
    }
    let orignalImageUrl=listing.imageUpload.imageurl;
    orignalImageUrl=orignalImageUrl.replace('/upload','/upload/h_150,w_200'); // resizing the image to width 200 for preview in edit form.

    res.render('listings/edit',{listing, orignalImageUrl});
};

module.exports.updateListing = async(req, res) => {
    const {id} = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.Listing});

    if(typeof req.file !=="undefined") // if user has uploaded a new image, then only update the imageUpload field.
    {let imageurl=req.file.path;
    let imagefilename=req.file.filename;
    updatedListing.imageUpload={imageurl, imagefilename};
    await updatedListing.save();
    }
        // If there was a previous image uploaded, we might want to delete it from cloud storage here.
    


    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${updatedListing._id}`);
};

module.exports.deleteListing = async(req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a listing!');
    res.redirect('/listings');
};
