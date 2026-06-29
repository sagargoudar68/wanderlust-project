const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validatelisting} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router
  .route("/") //index
  .get(wrapAsync(listingController.index))
  .post(   //create route
    isLoggedIn,
    upload.single('listing[image]'),
     validatelisting,
    wrapAsync(listingController.createListing)
  );


// New Route
router.get(
  "/new",
  isLoggedIn,
  listingController.renderNewForm
);

// ================= SEARCH ROUTE =================
router.get("/search", async (req, res) => {

  console.log("QUERY =", req.query);
  console.log("Q =", req.query.q);

  let { q } = req.query;

  let allListings = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } }
    ]
  });

  res.render("listings/index.ejs", { allListings });
});

// Show, Update, Delete Routes
router
  .route("/:id")
  .get(wrapAsync(listingController.ShowListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validatelisting,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.detroyListing)
  );


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm)
);

module.exports = router;