const axios = require("axios");
const HttpError = require("../models/http-errors");

function getCoordsForAddress(address){
    return {
        lat: 51.4968281,
        long:-116.4883804
    }
    // const response = await axios.get(
    //     `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    //       address
    //     )}&key=${API_KEY}`
    //   );
    
    // const data = response.data;

    // if (!data || data.status === 'ZERO RESULTS'){
    //     const error = new HttpError(
    //         'Could not find location for the specified address.',
    //         422
    //       );
    //       throw error;
    // }
    
    // const coordinates = data.results[0].geometry.location;

    // return coordinates;
}

module.exports = getCoordsForAddress;