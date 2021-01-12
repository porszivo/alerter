const collection = 'server';

const ServerSchema = {

    name: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    lastChecked: {
        type: String,
        required: false
    }
};
