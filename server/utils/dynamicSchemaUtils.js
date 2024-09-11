
const mongoose = require('mongoose');
// const { createDynamicModel } = require('./dynamicSchemaUtils');
// 
const createDynamicSchema = (fields) => {
    const schemaDefinition = {};
    fields.forEach(field => {
        schemaDefinition[field.name] = 
        { type: 
            mongoose.Schema.Types[field.type], 
            required: field.required
         };
    });
    return new mongoose.Schema(schemaDefinition);
};

// const createDynamicModel = (collectionName, fields) => {
//     const schema = createDynamicSchema(fields);
//     return mongoose.model(collectionName, schema);
// };

const createDynamicModel = (collectionName, fields = null) => {
    const schemaDefinition = {};
    if (fields) {
        fields.forEach(field => {
            schemaDefinition[field.name] = {
                type: mongoose.Schema.Types[field.type],
                required: field.required,
            };
        });
    }
    const schema = new mongoose.Schema(schemaDefinition, { strict: false });
    return mongoose.model(collectionName, schema);
};



const getDynamicModel = (collectionName, fields = null) => {
    try {
        return mongoose.model(collectionName);
    } catch (error) {
        if (fields) {
            return createDynamicModel(collectionName, fields);
        } else {
            throw new Error(`Model for collection "${collectionName}" not found and no fields provided to create one.`);
        }
    }
};

const addItemToCollection = async (collectionName, item, fields = null) => {
    const model = getDynamicModel(collectionName, fields);
    const newItem = new model(item);
    return await newItem.save();
};


exports.addItem = async (req, res) => {
    const { collectionName, item, fields } = req.body;

    try {
        const savedItem = await addItemToCollection(collectionName, item, fields);
        res.status(201).json({ message: `Item added to collection ${collectionName} successfully`, item: savedItem });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getAllCollections = async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    return collections.map(collection => collection.name);
};

module.exports = { createDynamicModel, addItemToCollection, getAllCollections};
