const Listing = require("../models/listing.js");

module.exports.index =async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}

module.exports.ShowListing =(async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({path:"reviews",
      populate:{
        path:"author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings"); // ✅ return is important
  }
   console.log(listing.reviews);
  res.render("listings/show.ejs", { listing });
})

module.exports.createListing =(async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
  })

  module.exports.renderEditForm =(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if (!listing) {
      req.flash("error","Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  });

  module.exports.updateListing = (async (req, res) => {
      let { id } = req.params;
      if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
      }
      let listing=await Listing.findByIdAndUpdate(id, {
        ...req.body.listing,

      });
       if(typeof req.file !== "undefined"){
       let url = req.file.path;
       let filename = req.file.filename;
       listing.image = {url, filename};
       await listing.save();
       }
      req.flash("success", "Updated Listing!");
      res.redirect(`/listings/${id}`);
    });

    module.exports.detroyListing =(async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      req.flash("success","Listing Deleted!");
      res.redirect("/listings");
    });

    // ================= SEARCH LISTINGS =================
module.exports.searchListings = async (req, res) => {
  let { q } = req.query;

  console.log("Searching for:", q);

  let allListings = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } }
    ]
  });

  res.render("listings/index.ejs", { allListings });
};
// ===================================================