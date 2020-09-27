const firestore = require('firebase')

var firebaseConfig = {
    apiKey: "AIzaSyCOw5ZPWXk8AYIITbrdRZ3wIv2hd6Mb6SI",
    authDomain: "casting-2a685.firebaseapp.com",
    databaseURL: "https://casting-2a685.firebaseio.com",
    projectId: "casting-2a685",
    storageBucket: "casting-2a685.appspot.com",
    messagingSenderId: "59702835666",
    appId: "1:59702835666:web:1442aacc07e6bec3ddb00b",
    measurementId: "G-RPN74YX79J"
};
// Initialize Firebase
firestore.initializeApp(firebaseConfig);

module.exports = {
    firestore: firestore,
}