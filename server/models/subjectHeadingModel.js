const mongoose = require('mongoose');

const subjectHeadingSchema = new mongoose.Schema({
    bibliographicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bibliographic', required: true },
    headings: [{ type: String }],
    keywords: [{ type: String }]
});

const SubjectHeading = mongoose.model('SubjectHeading', subjectHeadingSchema);

module.exports = SubjectHeading;
