const firebase = require("firebase")
const fs = require("fs")

// TODO add timestamp to filename
const outputLoc = "/path/to/cookbook_backup_YYYY_MM_DD.json"

const config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
}
const fire = firebase.initializeApp(config)

let recRef = fire.firestore().collection('recipes')

let data = {}

recRef.get().then(query => {
    query.forEach(doc => {
        console.log('reading recipe ', doc.id)
        data[doc.id] = doc.data()
    })
})
.then(() => {  
    fs.writeFile(outputLoc, JSON.stringify(data, null, 2), (err) => {
        if(err) {
            console.log('ERROR!', err)
        }
    })
})