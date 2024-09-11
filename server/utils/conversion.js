const Mapping = require('../models/mappingModel');

const convertDdcToLcc = async (ddcCode) => {
    const mapping = await Mapping.findOne({ ddcCode });
    if (mapping) {
        return mapping.lccCode;
    } else {
        throw new Error(`Mapping for DDC code ${ddcCode} not found.`);
    }
};

module.exports = { convertDdcToLcc };
