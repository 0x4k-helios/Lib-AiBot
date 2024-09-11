const xml2js = require('xml2js');
const csv = require('csv-parser');
const fs = require('fs');

// Extract metadata from JSON
const extractMetadataFromJson = (jsonData) => {
    return jsonData;
};

// Extract metadata from XML
const extractMetadataFromXml = async (xmlData) => {
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlData);
    return result;
};

// Extract metadata from CSV
const extractMetadataFromCsv = (csvFilePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

// Ensure that required fields are present and valid
const ensureRequiredFields = (metadata, requiredFields) => {
    const missingFields = requiredFields.filter(field => !metadata.hasOwnProperty(field));
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
};

// Validate metadata values
const validateMetadataValues = (metadata, validationRules) => {
    for (const field in validationRules) {
        if (metadata.hasOwnProperty(field)) {
            const value = metadata[field];
            const rules = validationRules[field];

            if (rules.type && typeof value !== rules.type) {
                throw new Error(`Field "${field}" should be of type ${rules.type}`);
            }

            if (rules.regex) {
                const regex = new RegExp(rules.regex);
                if (!regex.test(value)) {
                    throw new Error(`Field "${field}" does not match the required format`);
                }
            }
        }
    }
};




module.exports = { extractMetadataFromJson, extractMetadataFromXml, extractMetadataFromCsv, ensureRequiredFields, validateMetadataValues };
