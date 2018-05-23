const MongoClient = require('mongodb').MongoClient

const dbUrl = 'mongodb://admin:admin@116.85.36.172:27017'

const ObjectId = require('mongodb').ObjectID

function __connectDb(database,callback) {
  MongoClient.connect(dbUrl, (err, client) => {
    if(err) {
      console.log(err)
      console.log('数据库连接失败')
      return
    }
    const db = client.db(database)
    callback(db, client)
  })
}

function find(database, collectionName, json, callback) {
  __connectDb(database, (db, client) => {
    var result = db.collection(collectionName).find(json)
    result.toArray((err, doc) => {
      if(err) console.log(err)
      else {
        callback&&callback(doc)
        client.close()
      }
    })
  })
}

function insert(database, collectionName, json, callback) {
  __connectDb(database, (db, client) => {
    db.collection(collectionName).insertOne(json, (err, doc) => {
      if(err) console.log(err)
      else {
        callback&& callback(doc)
        client.close()
      }
    })
  })
}

function update(database, collectionName, json, updateJson, callback) {
  __connectDb(database, (db, client) => {
    db.collection(collectionName).updateOne(json, {$set: updateJson}, (err, doc) => {
      if(err) console.log(err)
      else {
        callback&&callback(doc)
        client.close()
      }
    })
  })
}

function deleteOne(database, collectionName, json, callback) {
  __connectDb(database, (db, client) => {
    db.collection(collectionName).deleteOne(json, (err, doc) => {
      if(err) console.log(err)
      else {
        callback&& callback(doc)
        client.close()
      }
    })
  })
}

module.exports = {
  ObjectId: ObjectId,
  find: find,
  insert: insert,
  update: update,
  deleteOne: deleteOne
}