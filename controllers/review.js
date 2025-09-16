const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.renderReviewForm = async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    res.render('listings/review', { listing });
};

module.exports.createReview = async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    const review = new Review(req.body.review);
   // newReview.listing = listing._id; // Associate the review with the listing
    review.author = req.user._id; // Set the author of the review to the currently logged-in user
    //console.log(review);
    await review.save();
    listing.reviews.push(review._id); // Add the review to the listing's reviews array
    await listing.save();
    //console.log(listing.reviews);
    req.flash('success', 'Created a new review!');
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async(req, res) => {
    const {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove the review reference from the listing
    await Review.findByIdAndDelete(reviewId); // Delete the review document
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/listings/${id}`);
};