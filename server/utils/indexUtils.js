const mongoose = require('mongoose');

const createIndex = async (collectionName, indexFields) => {
    const model = mongoose.model(collectionName);
    const index = {};
    indexFields.forEach(field => {
        index[field] = 1;
    });

    await model.createIndexes([index]);
};

module.exports = { createIndex };
