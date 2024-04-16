const logSchema = require('../schemas/logs.schema');

const mongoose = require('mongoose');

const logsModel = mongoose.model('logs', logSchema);

module.exports = logsModel;