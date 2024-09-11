const mongoose = require('mongoose');

const bibliographicSchema = new mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	publicationDate: { type: Date, required: true },
	isbn: { type: String, required: true, unique: true }, // Unique constraint
});

const Bibliographic = mongoose.model('Bibliographic', bibliographicSchema);

module.exports = Bibliographic;
