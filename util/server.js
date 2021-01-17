const slack = require('./slack');

const net = require('net');

module.exports = {

    ping: (server, callback) => {

        const sock = new net.Socket();
        const ip = server.ip;
        const port = server.port;
        const servername = server.name;

        sock.setTimeout(100);
        sock.on('connect', () => {
            if (server.status === 'down') {
                server.lastChecked = Date.now();
                slack.sendMessage(`<!channel> :running: ${servername}:${port}`);
                server.status = 'up';
            }
            server.checked.push({timestamp: server.lastChecked, status: 'up'});
            callback(null, server);
            sock.destroy();
        }).on('error', (e) => {
            if (server.status === 'up') {
                server.lastChecked = Date.now();
                slack.sendMessage(`<!channel> :rotating_light: ${servername}:${port}`);
                server.status = 'down';
            }
            server.checked.push({timestamp: server.lastChecked, status: 'down'});
            callback(null, server);
        }).on('timeout', (e) => {
        }).connect(port, ip);
    }
};
