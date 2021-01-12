const db = require('./util/db');

const net = require('net');
const settings = require('./config/config');
const log4js = require('log4js');
const {sendMessage} = require('./util/slack');

log4js.configure({
    appenders: {cheese: {type: 'file', filename: 'cheese.log'}},
    categories: {default: {appenders: ['cheese'], level: 'info'}}
});

const logger = log4js.getLogger('cheese');

const init = async () => {
    for (const server of settings.server) {
        const obj = {
            name: server.name
        };
        const bla = await db.get(obj, 'server').then(res => {
            return res;
        });
        if (bla == null) {
            const sObj = {
                name: server.name,
                ip: server.ip,
                port: server.port,
                status: 'down',
                lastChecked: Date.now()
            };
            await db.create(sObj, 'server');
        }
    }
};

db.connect().then(r => {
    logger.info('DB Connection established');
}).catch(err => {
    logger.error(err);
});

init().then(r => {
    setInterval(() => {
        db.getAll('server').then(
            re => {
                re.forEach(s => {
                    pingserver(s, (err, server) => {

                        const updateObject = {
                            $set: {
                                status: server.status,
                                lastChecked: Date.now()
                            }
                        };

                        db.update({name: server.name},
                            updateObject,
                            'server').then(() => {
                            logger.info(`name ${server.name} set to ${server.status}`);
                        });
                    });
                });
            }
        );
    }, settings.interval);
});

const pingserver = (server, callback) => {
    const sock = new net.Socket();
    const ip = server.ip;
    const port = server.port;
    const servername = server.name;
    sock.setTimeout(100);
    sock.on('connect', () => {
        if (server.status === 'down') {
            const now = Date.now();
            const diff = convertMilliseconds(now - server.lastChecked);
            server.lastChecked = Date.now();
            sendMessage(`<!channel> :running: ${servername}:${port} Downtime: ${diff}`);
            server.status = 'up';
            callback(null, server);
        }
        sock.destroy();
    }).on('error', (e) => {
        if (server.status === 'up') {
            server.lastChecked = Date.now();
            sendMessage(`<!channel> :rotating_light: ${servername}:${port}`);
            server.status = 'down';
            callback(null, server);
        }
    }).on('timeout', (e) => {
    }).connect(port, ip);
};

const convertMilliseconds = (ms) => {
    let days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;

    total_seconds = parseInt(Math.floor(ms / 1000));
    total_minutes = parseInt(Math.floor(total_seconds / 60));
    total_hours = parseInt(Math.floor(total_minutes / 60));
    days = parseInt(Math.floor(total_hours / 24));

    seconds = parseInt(total_seconds % 60);
    minutes = parseInt(total_minutes % 60);
    hours = parseInt(total_hours % 24);

    let output = '';
    if (days !== 0) {
        output += days;
    }
    output += String(hours).padStart(2, '0') + ':';
    output += String(minutes).padStart(2, '0') + ':';
    output += String(seconds).padStart(2, '0');

    return output;
};

