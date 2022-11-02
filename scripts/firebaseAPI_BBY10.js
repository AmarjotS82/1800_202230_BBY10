var firebaseConfig = {
  apiKey: "AIzaSyCSe1PUTaxhYX42HacPoQhNx_aPy_IvOvY",
  authDomain: "team-10-1800-19c37.firebaseapp.com",
  projectId: "team-10-1800-19c37",
  storageBucket: "team-10-1800-19c37.appspot.com",
  messagingSenderId: "283231503342",
  appId: "1:283231503342:web:87b1dce8f40b1b752344ff"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();