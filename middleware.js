const Listing = require("./models/listing");
const Review = require("./models/review");
const { session } = require("passport");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema");

module.exports.isLoggedIn = (req,res, next) =>{
    if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports. validatelisting = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports .validatereview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};