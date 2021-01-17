const db = require('./util/db');
const settings = require('./config/config');
const log4js = require('log4js');
const _server = require('./util/server');

const port = 3000;
const express = require('express');
const app = express();

log4js.configure({
    appenders: {cheese: {type: 'file', filename: 'cheese.log'}},
    categories: {default: {appenders: ['cheese'], level: 'info'}}
});

const logger = log4js.getLogger('cheese');

db.connect().then(r => {
    logger.info('DB Connection established');
}).catch(err => {
    logger.error(err);
});

app.listen(port, () => {
    console.log('Server started on port ' + port);
});

setInterval(() => {
    db.getAll('server').then(serverList => {
        serverList.forEach(server => {
            _server.ping(server, (err, resp) => {

                const updateObject = {
                    $set: {
                        status: resp.status,
                        lastChecked: Date.now()
                    },
                    $push: {
                        checked: {timestamp: Date.now(), status: resp.status}
                    }
                };

                db.update({name: resp.name},
                    updateObject,
                    'server').then(() => {
                    logger.info(`name ${resp.name} set to ${resp.status}`);
                });
            });
        });
    });
}, settings.interval);
