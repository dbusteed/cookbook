#!/home/davis/opt/node/bin/node

const firebase = require("firebase")
const fs = require("fs")

// TODO add timestamp to filename
const outputLoc = "/home/davis/files/backups/cookbook/recipes.json"

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