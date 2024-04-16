const dgram = require('dgram');
const mongoose = require('mongoose');
const server = dgram.createSocket('udp4');
const logsModel = require('./db/models/logs.model');

async function connect() {
    try {
        await mongoose.connect(process.env.DB_URI);
    }
    catch(err) {
        process.exit(1);
    }
}

connect();

server.on('error', (err) => {
    console.error(`Server error:\n${err.stack}`);
    server.close();
})

server.on('message', (msg, rinfo) => {
    console.log(msg.toString())
    const logString = msg.toString();
    // Split the logString by comma
    const parts = logString.split(',');

    // Extract system value (type)
    const systemValue = parts[0].trim();

    // Check if the second part contains a level or not
    let level, message;
    if (parts.length > 1) {
        const remainingPart = parts[1].trim().split(' ');
        if (remainingPart.length > 1) {
            level = remainingPart[0].trim();
            message = remainingPart.slice(1).join(' ').trim();
        } else {
            message = remainingPart[0].trim();
        }
    }

    // Construct the object
    const logObject = {
        type: systemValue,
        level: level || null, // Assign null if level is not present
        message: message || null // Assign null if message is not present
    };
    logsModel.create(logObject)
})

server.on('listening', () => {
    const address = server.address();
    console.log(`Syslog server listening on ${address.address}:${address.port}`);
});

server.bind(514, '192.168.1.25');