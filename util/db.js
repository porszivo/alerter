const settings = require('../config/config');
const MongoClient = require('mongodb').MongoClient;

const uri = settings.database.url;
const client = MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = {

    connect: async () => {
        if (!client.isConnected()) {
            await client.connect().catch(err => {
                console.error('Error while connecting to database ', err);
            });
        }
    },

    get: async (server, collection) => {
        const db = await client.db(settings.database.name);
        return db.collection(collection).findOne(server);
    },

    create: async (obj, collection) => {
        const db = await client.db(settings.database.name);
        return db.collection(collection).insertOne(obj)
            .catch(err => {
                console.error('Error while writing data to database', err);
            });
    },

    update: async (filter, obj, collection) => {
        const db = await client.db(settings.database.name);
        return db.collection(collection).updateMany(filter, obj)
            .catch(err => {
                console.error('Error while writing data to database', err);
            });
    },

    getAll: async (collection) => {
        const db = await client.db(settings.database.name);
        return db.collection(collection).find({});
    }

};
