require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;

const DbObject = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const Database = process.env.dbName;
const url = process.env.mongoDbURl;
let dbClientConnection;

// connects server to database
const serverConnection = async () => {// returns a promise
    try {
        const client = await MongoClient.connect(url, DbObject); // gets client via mongo url and options
        dbClientConnection = await client.db(Database); // assigns dbclientconnection
        return ({ success: true, message: "connect to database " + Database })
    } catch (error) {
        console.log(error);
        return ({ success: false, message: error.getMessage });
    }
}


// gets documents in collections that match aggregate pipeline stages
const aggregateData = async (collections, object) => { // returns a promise
    try {
        const result = await dbClientConnection.collection(collections).aggregate(object).toArray();
        // returns an object with data:result(array) || message:error.name
        return ({ success: true, data: result })
    } catch (error) {
        return ({ success: false, message: error.name });
    }
}

// updates documents that match such query  
const updateData = async (collections, query, update, upsert) => {
    // returns a promise
    try {
        const result = await dbClientConnection.collection(collections).updateOne(query, update, upsert);
        // returns an object with message:updated successfully || message:error.getMessage
        return ({ success: true, message: "updated successfully" });
    } catch (error) {
        return ({ success: false, message: error.getMessage });
    }
}

// deletes the document in the collection that matches the object
const deleteData = async (collections, object) => {
    // returns a promise
    try {
        await dbClientConnection.collection(collections).deleteOne(object);
        // returns an object with message:deleted successfully || message:error.getMessage
        return ({ success: true, message: "deleted successfully" })
    } catch (error) {
        console.log(error);
        return ({ success: false, message: error.getMessage })
    }
}

// deletes the document in the collection that matches the object returns document
const findAndDeleteData = async (collections, filter,options) => {
    // returns a promise
    try {
        const result = await dbClientConnection.collection(collections).findOneAndDelete(filter, options);
         // returns an object with data:result(array) || message:error.getMessage
        return ({ success: true, data: result });
    } catch (error) {
        return ({ success: false, message: error.message });
    }
}

// inserts the document as per object into the collection
const insertOneData = async (collections, object) => {
    // return a promise
    try {
        const result = await dbClientConnection.collection(collections).insertOne(object);
        // returns an object with message:inserted successfully || message:error.getMessage
        return ({ success: true, message: "inserted successfully" });
    } catch (error) {
        console.log(error);
        return ({ success: false, message: error.getMessage });
    }
}

// inserts the document as per object into the collection
const insertData = async (collections, object) => {
    // return a promise
    try {
        const result = await dbClientConnection.collection(collections).insert(object);
        // returns an object with message:inserted successfully || message:error.getMessage
        return ({ success: true, message: "inserted successfully",...result });
    } catch (error) {
        return ({ success: false, message: error.message });
    }
}

// finds the document that matches query in collections
const findData = async (collections, query) => {
    // return a promise
    try {
        const result = await dbClientConnection.collection(collections).find(query).toArray();
        // returns an object with data:result(array) || message:error.getMessage // data:[foundData]
        return ({ success: true, data: result });
    } catch (error) {
        return ({ success: false, message: error.getMessage });
    }
}

module.exports = {
    serverConnection,
    findData,
    updateData,
    deleteData,
    insertData,
    aggregateData,
    insertOneData,
    findAndDeleteData,
}