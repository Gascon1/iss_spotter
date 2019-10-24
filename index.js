// index.js
const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  console.log('It worked! Returned IP:', ip);

  fetchCoordsByIP(ip, (error, myCoords) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }
    console.log('It worked! Returned coords:', myCoords);
    fetchISSFlyOverTimes(myCoords, (error, issPass) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }
      console.log('It worked! Returned coords:', issPass);
    })

  })
});

