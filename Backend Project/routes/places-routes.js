const express = require("express");
const placesController = require ("../controllers/places-controllers");
const router = express.Router();
const {check} = require("express-validator");
const fileUpload = require('../middleware/file-upload');
const authToken = require('../middleware/check-auth')

router.get('/:pid', placesController.getPlaceById );

router.get("/user/:uid", placesController.getPlaceByUserId);

router.use(authToken);

router.post(
    "/",
    fileUpload.single('image'),
    [check('title').not().isEmpty(),
    check('description').isLength({min:5}),
    check('address').not().isEmpty() 
    ] 
    ,placesController.createPlace);

router.patch("/:pid",    
    [check('title').not().isEmpty(),
    check('description').isLength({min:5})
    ] ,
    placesController.updatePlace);

router.delete("/:pid",placesController.deletePlace);

module.exports = router;