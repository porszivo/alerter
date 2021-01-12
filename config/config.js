const settings = {
    token: '',
    interval: 1500,
    channel: '#bottest'
};

settings.database = {
    url: 'mongodb://nucci.fritz.box:27017/Cluster1?retryWrites=true&w=majority',
    name: 'alertbot-test'
}

settings.server = [
    {name: 'imaps@mail.qupe.de', ip: '87.106.181.33', port: '993'},
    {name: 'https@mail.qupe.de', ip: '87.106.181.33', port: '443'},
    {name: 'https@www.qupe.de', ip: '85.214.245.235', port: '443'},
];

module.exports = settings;
