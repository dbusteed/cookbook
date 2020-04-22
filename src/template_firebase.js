// add config then rename as `firebase.js`

import firebase from 'firebase'

var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
}
var fire = firebase.initializeApp(config)

export default fire;