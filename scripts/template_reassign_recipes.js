const firebase = require("firebase")

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
const db = fire.firestore()

old_uid = ''
new_uid = ''

db.collection('recipes').get().then(query => {
    query.forEach(doc => {
        let rec = doc.data()
        if (rec.uid === old_uid) {
            rec.uid = new_uid
            console.log('updating', rec.name)
            db.collection('recipes').doc(doc.id).set(rec)
        }
    })
})
