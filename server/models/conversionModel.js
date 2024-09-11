const mongoose = require('mongoose');
const Mapping = require('./mappingModel');

class Conversion {
    static async convertDdcToLcc(ddcCode) {
        if (!ddcCode) {
            throw new Error('DDC code is required for conversion');
        }

        const mapping = await Mapping.findOne({ ddcCode });
        
        if (!mapping) {
            throw new Error(`No LCC code found for DDC code: ${ddcCode}`);
        }

        return mapping.lccCode;
    }
}

module.exports = Conversion;
