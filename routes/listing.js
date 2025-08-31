const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Expresserror = require("../utils/Expresserror.js")// const {listingSchema , reviewSchema} = require("../schema.js")
const Listing = require("../models/listing.js") //indicztion error not a problem
const {isLoggedIn ,isOwner , validateListing} = require("../middleware.js");
// const validatelisting = (req,res,next)=>{
//     let{error}= listingSchema.validate(req.body);
//     if (error){
//         let errmsg = error.details.map((el)=> el.message).join(",");
//         throw new Expresserror(404,errmsg);
//     }else{
//         next();
//     }
// };

const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../CloudConfig.js");
const upload = multer({storage});
// new Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//Create Route
// Index Route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn, 
        upload.single('listing[image]'),
        wrapAsync(listingController.createListing),
        validateListing,
    );
// Update route
//show
// delete
router
    .route("/:id")
    .put(isLoggedIn, listingController.updateListing)
    .get(wrapAsync(listingController.showListing))
    .delete(isLoggedIn , isOwner, wrapAsync(listingController.destroyListing));


// Edit Route 
router.get("/:id/edit", isLoggedIn, 
    wrapAsync(listingController.renderEditForm));


module.exports = router;