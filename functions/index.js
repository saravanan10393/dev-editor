const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.perfTest = functions.https.onRequest((request, response) => {
  console.log("======= Request header =====", request.header);
  console.log("======= Request body =====", request.body);
  response.send("Hello from Firebase!");
});
