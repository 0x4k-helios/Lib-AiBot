const Conversion = require('../models/conversionModel');
const Mapping = require('../models/mappingModel');
const Heading = require('../models/headingModel');

exports.convertDdcToLcc = async (req, res) => {
    const { ddcCode } = req.body;

    try {
        const lccCode = await Conversion.convertDdcToLcc(ddcCode);
        res.json({ ddcCode, lccCode });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.uploadMappings = async (req, res) => {
    const mappings = req.body;

    try {
        // Validate the input
        if (!Array.isArray(mappings)) {
            throw new Error('Mappings should be an array of JSON objects');
        }

        // Insert the mappings into the database
        const result = await Mapping.insertMany(mappings);
        res.status(201).json({ message: 'Mappings uploaded successfully', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.generateHeadings = async (req, res) => {
    const mappings = req.body;

    try {
        if (!Array.isArray(mappings)) {
            throw new Error('Mappings should be an array of JSON objects');
        }

        const headings = mappings.map(mapping => {
            const { ddcCode, lccCode } = mapping;
            const subjectHeading = generateSubjectHeading(ddcCode, lccCode);
            return { ddcCode, lccCode, subjectHeading };
        });

        const result = await Heading.insertMany(headings);
        res.status(201).json({ message: 'Headings generated and uploaded successfully', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const generateSubjectHeading = (ddcCode, lccCode) => {
    // Example logic to generate subject headings dynamically
    // This function should be customized based on actual subject heading generation rules
    let subjectHeading = "";

    // Simple example rule: concatenate DDC and LCC descriptions
    const ddcDescription = getDdcDescription(ddcCode);
    const lccDescription = getLccDescription(lccCode);

    if (ddcDescription && lccDescription) {
        subjectHeading = `${ddcDescription} - ${lccDescription}`;
    } else if (ddcDescription) {
        subjectHeading = ddcDescription;
    } else if (lccDescription) {
        subjectHeading = lccDescription;
    } else {
        subjectHeading = "Unknown Subject";
    }

    return subjectHeading;
};

const getDdcDescription = (ddcCode) => {
    // Example logic to get DDC description
    // In a real-world scenario, you would look up descriptions from a reference table or API
    const ddcDescriptions = {
        "000": "Generalities",
        "100": "Philosophy & Psychology",
        "200": "Religion",
        "300": "Social Sciences",
        "400": "Language",
        "500": "Science",
        "600": "Technology",
        "700": "Arts & Recreation",
        "800": "Literature",
        "900": "History & Geography",
    };

    return ddcDescriptions[ddcCode] || null;
};

const getLccDescription = (lccCode) => {
    // Example logic to get LCC description
    // In a real-world scenario, you would look up descriptions from a reference table or API
    const lccDescriptions = {
        "A": "General Works",
        "B": "Philosophy, Psychology, Religion",
        "BL": "Religions. Mythology. Rationalism",
        "HM": "Sociology",
        "P": "Language and Literature",
        "Q": "Science",
        "T": "Technology",
        "N": "Fine Arts",
        "PN": "Literature (General)",
        "D": "History (General)",
    };

    return lccDescriptions[lccCode] || null;
};