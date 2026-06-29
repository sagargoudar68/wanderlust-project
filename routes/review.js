const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review");
const Listing = require("../models/listing.js");
const {validatereview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

///post route
router.post("/", isLoggedIn, validatereview, wrapAsync(reviewController.createreview));


//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
   wrapAsync(reviewController.destroyReview));

module.exports = router;