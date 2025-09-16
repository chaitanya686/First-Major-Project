const Listing = require('./models/listing');
const Review = require('./models/review');
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require('./schema.js');



module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //if user is not authenticated-redirect orignalUrl to session and then redirect to login page
        req.session.redirectUrl=req.originalUrl; //originalUrl is a property of req object that contains the url of the request
        req.flash('error', 'You must be logged in first!');
        return res.redirect('/login');
    }
    next();
};


module.exports.saveRedirectUrl = async (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl; //passport cannot reset the redirectUrl variable in session so we are setting it to res.locals
    }   
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)){
        req.flash('error', 'You are not the author of this review!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};  

module.exports.validateListing = (req, res,next) => {
    let {error} =listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(",");
        throw (new ExpressError(400, errMsg));
    }else{
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw (new ExpressError(400, errMsg));
    } else {
        next();
    }
};