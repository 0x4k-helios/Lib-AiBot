const mongoose = require('mongoose');

const mappingSchema = new mongoose.Schema({
    ddcCode: { type: String, required: true },
    lccCode: { type: String, required: true },
});

const Mapping = mongoose.model('Mapping', mappingSchema);

module.exports = Mapping;
