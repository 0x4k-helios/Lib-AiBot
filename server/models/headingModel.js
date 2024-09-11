const mongoose = require('mongoose');

const headingSchema = new mongoose.Schema({
    ddcCode: { type: String, required: true },
    lccCode: { type: String, required: true },
    subjectHeading: { type: String, required: true },
});

const Heading = mongoose.model('Heading', headingSchema);

module.exports = Heading;
