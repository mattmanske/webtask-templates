"use latest"

//-----------  ReadMe  -----------//

// Writes a record to Firebase

// Body Object
// -----------
// ref   : Database storage reference [string]
// key   : (optional) Record key (will try and update if available) [string/number]
// data  : Deta record to be saved [string/number/object]
// force : (optional) Force data overwrite [boolean]

// Env Secrets
// -----------
// FIREBASE_API_KEY    : Secret API key
// FIREBASE_PROJECT_ID : Project ID & URL subdomain

// Return
// -----------
// data : Database storage reference [string/number/object]
// url  : Firebase data URL [string]

//-----------  Imports  -----------//

const Firebase = require('firebase@3.6.9')

//-----------  Export  -----------//

module.exports = (ctx, cb) => {
  try {
    const { FIREBASE_API_KEY, FIREBASE_PROJECT_ID } = ctx.secrets
    const { ref, key, data, force, ...body } = JSON.parse(ctx.body_raw)

    const app = Firebase.initializeApp({
      apiKey      : FIREBASE_API_KEY,
      databaseURL : `https://${FIREBASE_PROJECT_ID}.firebaseio.com`,
    })

    const refStr = (key) ? `${ref}/${key}` : ref
    const record = app.database().ref(refStr)

    if (!key){
      record.transaction((current) => {
        return (force) ? data : Object.assign({}, current.val(), data)
      }, (err, committed, snapshot) => {
        return (err) ? cb(err) : cb(null, { data: snapshot.val(), url: record.toString() })
      })
    } else {
      record.push(data)
      app.delete()

      return cb(null, { data, url: record.toString() })
    }
  } catch (err){
    return cb(err)
  }
}
