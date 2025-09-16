const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');


const reviewController=require('../controllers/review');

//review wala route
router.get('/', isLoggedIn, wrapAsync(reviewController.renderReviewForm));
//review post wala route
router.post('/', validateReview, wrapAsync(reviewController.createReview));

//review delete wala route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;