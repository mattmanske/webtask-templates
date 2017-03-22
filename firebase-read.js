"use latest"

//-----------  ReadMe  -----------//

// Writes a record to Firebase

// Body Object
// -----------
// ref: Database storage reference [string]

// Env Secrets
// -----------
// FIREBASE_API_KEY    : Secret API key
// FIREBASE_PROJECT_ID : Project ID & URL subdomain

//-----------  Imports  -----------//

const Firebase = require('firebase@3.6.9')

//-----------  Export  -----------//

module.exports = (ctx, cb) => {
  try {
    const { FIREBASE_API_KEY, FIREBASE_PROJECT_ID } = ctx.secrets
    const { ref, ...body } = JSON.parse(ctx.body_raw)

    const app = Firebase.initializeApp({
      apiKey      : FIREBASE_API_KEY,
      databaseURL : `https://${FIREBASE_PROJECT_ID}.firebaseio.com`,
    })

    app.database().ref(ref).once('value').then((snapshot) => {
      app.delete()
      return cb(null, snapshot.val())
    })
  } catch (err){
    return cb(err)
  }
}
