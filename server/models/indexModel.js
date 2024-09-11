const mongoose = require('mongoose');

const indexSchema = new mongoose.Schema({
    collectionName: { type: String, required: true },
    indexFields: [{ type: String, required: true }],
    createdAt: { type: Date, default: Date.now }
});

const Index = mongoose.model('Index', indexSchema);

module.exports = Index;
