const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const fetchMyIP = (callback) => {
  const URL = 'https://api.ipify.org?format=json'
  request(URL, (error, response, body) => {
    if (error) {
      callback(error.message);
      // if non-200 status, assume server error
    } else {
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }
      const myIP = JSON.parse(body).ip
      callback(null, myIP);
    }
  })
};

const fetchCoordsByIP = (ip, callback) => {
  const URL = 'https://ipvigilante.com/' + ip
  request(URL, (error, response, body) => {
    if (error) {
      callback(error.message);
      // if non-200 status, assume server error
    } else {
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching coords. Response: ${body}`;
        callback(new Error(msg), null);
        return;
      }
      const myCoords = JSON.parse(body)
      let myCoordsObject = {}
      myCoordsObject.latitude = myCoords.data.latitude;
      myCoordsObject.longitude = myCoords.data.longitude;
      callback(null, myCoordsObject);
    }
  })
};


/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function (coords, callback) {
  
  const URL = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(URL, (error, response, body) => {
    if (error) {
      callback(error.message);
      // if non-200 status, assume server error
    } else {
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching ISS pass time. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }
      const issPass = JSON.parse(body).response;
      callback(null, issPass);
    }
  });
}

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };