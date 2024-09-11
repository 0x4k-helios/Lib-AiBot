const mongoose = require('mongoose');

const classificationSchema = new mongoose.Schema({
    bibliographicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bibliographic', required: true },
    ddc: { type: String },
    lcc: { type: String }
});

const Classification = mongoose.model('Classification', classificationSchema);

module.exports = Classification;
