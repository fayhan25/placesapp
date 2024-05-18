const HttpError = require("../models/http-errors");
const fs = require("fs");
const {validationResult} = require("express-validator");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");
const User = require('../models/users');
const mongoose = require('mongoose');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      'Could not find place for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};


const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let places;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later.',
      500
    );
    return next(error);
  }

  // if (!places || places.length === 0) {
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map(place =>
      place.toObject({ getters: true })
    )
  });
};
  const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw (new HttpError('Invalid inputs passed, please check your data.', 422));
    }
  
    const { title, description, address, creatorId } = req.body;
  
    let location;
  
    location = getCoordsForAddress(address);
 

    const createdPlace = new Place ({
      title,
      description,
      address,
      coordinates : location,
      image : req.file.path.replace("\\", "/"),
      creatorId: req.userData.userId
    });
  
    let user;

    try{
      user = await User.findById(req.userData.userId);
    }
    catch(err){
      return next(new HttpError("Could not find place with that userID",500));
    }
    
    if (!user){
      return next(new HttpError("User does not exsit ",500));
    }

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdPlace.save({session:sess})
      user.places.push(createdPlace);
      await user.save({session:sess});
      await sess.commitTransaction();
    } catch (error) {
      return next(new HttpError("Could not find ",500))
    }
    res.status(201).json({ place: createdPlace });
  };

  const updatePlace = async (req,res,next)=> {
    const error = validationResult(req);
    if (!error.isEmpty()){
        return next(new HttpError("Your updated inputs are invalid please try again",422));
    }
    const {title,description} = req.body;
    const placeId = req.params.pid;

    let place
    try{
      place = await Place.findById(placeId);
    }
    catch(err){
      const error = new HttpError("Could not update the place because id could not be found",500);
      return next(error);
    }

    if (place.creatorId.toString() !== req.userData.userId){
      const error = new HttpError("You dont have permission to edit this file",401);
      return next(error);
    }

    place.title = title;
    place.description = description;
    try{
      await place.save();
    }
    catch(err){
      const error = new HttpError("Could not save the place to database",500)
      return next(error);
    }



    res.status(200).json({place: place.toObject({getters:true})});
}

  const deletePlace = async (req,res,next) => {
    const placeId = req.params.pid;

    let place;
    try {
      place = await Place.findById(placeId).populate('creatorId');
    } catch (err) {
      const error = new HttpError("could not delete place",500);
      return next(error);
    }

    if (!place){
      const error = new HttpError("Could not find place",500);
      return next(error);
    }

    if (place.creatorId.id !== req.userData.userId){
      const error = new HttpError("You dont have permission to delete this file",401);
      return next(error);
    }


    imagePath = place.image;
    try{
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await place.remove({session:sess})
      place.creatorId.places.pull(place);
      await place.creatorId.save({session:sess});
      await sess.commitTransaction();
    }
    catch(err){
     return next( new HttpError("Could not remove place",500));
    }

    fs.unlink(imagePath, err => {
      console.log(err);
    });

    res.status(200).json({message : "Deleted the place"});

  }

  exports.getPlaceById = getPlaceById;
  exports.getPlaceByUserId = getPlaceByUserId;
  exports.createPlace = createPlace;
  exports.updatePlace = updatePlace;
  exports.deletePlace = deletePlace;