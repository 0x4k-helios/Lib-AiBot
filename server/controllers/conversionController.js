const Conversion = require('../models/conversionModel');
const Mapping = require('../models/mappingModel');
const Heading = require('../models/headingModel');
const Bibliographic = require('../models/bibliographicModel');
const generateMARC21 = require('../utils/marc21Generator');
const { convertDdcToLcc } = require('../utils/conversion');
const Classification = require('../models/classificationModel');
const { classifyDDC, classifyLCC, convertDDCtoLCC } = require('../utils/classificationUtils');
const SubjectHeading = require('../models/subjectHeadingModel');
const { generateSubjectHeadings, generateKeywords } = require('../utils/subjectHeadingUtils');
const Index = require('../models/indexModel');
const { createIndex } = require('../utils/indexUtils');
const { fetchBookDetails } = require('../utils/bookUtils');
const { createDynamicModel, addItemToCollection, getAllCollections } = require('../utils/dynamicSchemaUtils');
const { extractMetadataFromJson, extractMetadataFromXml, ensureRequiredFields, validateMetadataValues, extractMetadataFromCsv } = require('../utils/metadataUtils');
const mongoose = require('mongoose');

exports.getBookDetails = async (req, res) => {
	const { isbn } = req.params;

	try {
		const bookDetails = await fetchBookDetails(isbn);
		res.status(200).json(bookDetails);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.convertDdcToLcc = async (req, res) => {
	const { ddcCode } = req.body;

	try {
		const lccCode = await Conversion.convertDdcToLcc(ddcCode);
		res.json({ ddcCode, lccCode });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.convertClassification = async (req, res) => {
	const { classificationId } = req.body;

	try {
		const classification = await Classification.findById(classificationId);
		if (!classification) {
			throw new Error('Classification record not found');
		}

		const newLcc = convertDDCtoLCC(classification.ddc);
		classification.lcc = newLcc;
		await classification.save();

		res.status(200).json({ message: 'DDC to LCC conversion successful', classification });
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

exports.getHeadings = async (req, res) => {
	try {
		const headings = await Heading.find().sort({ ddcCode: 1 });
		res.status(200).json(headings);
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

		// Extract DDC codes from mappings
		const ddcCodes = mappings.map((mapping) => mapping.ddcCode);

		// Find existing headings with the same DDC codes
		const existingHeadings = await Heading.find({ ddcCode: { $in: ddcCodes } });
		const existingDdcCodes = existingHeadings.map((heading) => heading.ddcCode);

		const headingsResults = await Promise.all(
			mappings.map(async (mapping) => {
				const { ddcCode } = mapping;

				if (existingDdcCodes.includes(ddcCode)) {
					return { ddcCode, status: 'existing' };
				}

				const lccCode = await convertDdcToLcc(ddcCode);
				const subjectHeading = generateSubjectHeading(ddcCode, lccCode);
				return { ddcCode, lccCode, subjectHeading, status: 'new' };
			})
		);

		const newHeadings = headingsResults.filter((heading) => heading.status === 'new');
		const existingHeadingsInRequest = headingsResults.filter((heading) => heading.status === 'existing');

		let result = [];
		if (newHeadings.length > 0) {
			result = await Heading.insertMany(newHeadings);
		}

		const response = {
			message: 'Headings processing completed',
			newHeadings: result,
			existingHeadings: existingHeadingsInRequest,
			summary: {
				total: mappings.length,
				new: newHeadings.length,
				existing: existingHeadingsInRequest.length,
			},
		};

		res.status(200).json(response);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Delete DDC code
exports.deleteDdcCode = async (req, res) => {
	try {
		const { ddcCode } = req.params;
		const result = await Heading.deleteOne({ ddcCode });
		if (result.deletedCount === 0) {
			return res.status(404).json({ message: `DDC code ${ddcCode} not found.` });
		}
		res.status(200).json({ message: `DDC code ${ddcCode} deleted successfully.` });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.createBibliographicRecord = async (req, res) => {
	const { title, author, publicationDate, isbn } = req.body;

	try {
		// Check if a bibliographic record with the same ISBN already exists
		const existingRecord = await Bibliographic.findOne({ isbn });
		if (existingRecord) {
			return res.status(400).json({ error: 'A bibliographic record with this ISBN already exists' });
		}

		// Create a new bibliographic record
		const bibliographic = new Bibliographic({ title, author, publicationDate, isbn });
		await bibliographic.save();

		const marc21Record = generateMARC21(bibliographic);

		res.status(201).json({ message: 'Bibliographic record created', marc21Record });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.getBibliographicRecord = async (req, res) => {
	const { id } = req.params;

	try {
		const bibliographic = await Bibliographic.findById(id);
		if (!bibliographic) {
			return res.status(404).json({ error: 'Bibliographic record not found' });
		}
		res.status(200).json(bibliographic);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.getBibliographicRecords = async (req, res) => {
	try {
		const bibliographicRecords = await Bibliographic.find({});
		res.status(200).json(bibliographicRecords);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

exports.classifyBibliographicRecord = async (req, res) => {
	const { bibliographicId } = req.body;

	try {
		// Check if the bibliographic record exists
		const bibliographic = await Bibliographic.findById(bibliographicId);
		if (!bibliographic) {
			throw new Error('Bibliographic record not found');
		}

		// Check if a classification already exists for this bibliographic record
		const existingClassification = await Classification.findOne({ bibliographicId });
		if (existingClassification) {
			return res.status(200).json({ message: 'Classification already exists', classification: existingClassification });
		}

		// Create a new classification and save it to the database
		const ddc = classifyDDC(bibliographic.title, bibliographic.author);
		const lcc = classifyLCC(bibliographic.title, bibliographic.author);

		const classification = new Classification({ bibliographicId, ddc, lcc });
		await classification.save();

		res.status(201).json({ message: 'Classification created', classification });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

exports.generateHeadingsAndKeywords = async (req, res) => {
	const { bibliographicId } = req.body;

	try {
		const bibliographic = await Bibliographic.findById(bibliographicId);
		if (!bibliographic) {
			throw new Error('Bibliographic record not found');
		}

		// Check if a subject heading and keywords already exist for this bibliographic record
		const existingSubjectHeading = await SubjectHeading.findOne({ bibliographicId });
		if (existingSubjectHeading) {
			return res.status(200).json({ message: 'Subject headings and keywords already exist', subjectHeading: existingSubjectHeading });
		}

		const headings = generateSubjectHeadings(bibliographic.title, bibliographic.author);
		const keywords = generateKeywords(bibliographic.title, bibliographic.author);

		const subjectHeading = new SubjectHeading({ bibliographicId, headings, keywords });
		await subjectHeading.save();

		res.status(201).json({ message: 'Subject headings and keywords generated', subjectHeading });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// exports.createIndex = async (req, res) => {
//     const { collectionName, indexFields } = req.body;

//     try {
//         await createIndex(collectionName, indexFields);

//         const index = new Index({ collectionName, indexFields });
//         await index.save();

//         res.status(201).json({ message: 'Index created successfully', index });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// Create an index on the specified fields in the specified collection
exports.createIndex = async (req, res) => {
	const { collectionName, indexFields } = req.body;

	try {
		// Create or retrieve the model for the collection
		const model = mongoose.models[collectionName] || createDynamicModel(collectionName);

		// Create index on the specified fields
		const indexFieldsObject = {};
		indexFields.forEach((field) => {
			indexFieldsObject[field] = 1;
		});

		await model.collection.createIndex(indexFieldsObject);

		// Save index information to the Index collection
		const index = new Index({ collectionName, indexFields });
		await index.save();

		res.status(201).json({ message: `Index created on collection ${collectionName} successfully`, index });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// Create Schemas and fields for collections.
exports.createCollection = async (req, res) => {
	const { collectionName, fields } = req.body;

	try {
		createDynamicModel(collectionName, fields);
		res.status(201).json({ message: `Collection ${collectionName} created successfully` });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
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

// Get All Collections
exports.getAllCollections = async (req, res) => {
	try {
		const collections = await getAllCollections();
		res.status(200).json({ collections });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// exports.extractMetadata = async (req, res) => {
// 	const { format, data } = req.body;

// 	try {
// 		let metadata;
// 		if (format === 'json') {
// 			metadata = extractMetadataFromJson(data);
// 		} else if (format === 'xml') {
// 			metadata = await extractMetadataFromXml(data);
// 		} else if (format === 'csv') {
// 			metadata = await extractMetadataFromCsv(data);
// 		} else {
// 			throw new Error('Unsupported format');
// 		}

// 		res.status(200).json({ metadata });
// 	} catch (error) {
// 		res.status(400).json({ error: error.message });
// 	}
// };
exports.extractMetadata = async (req, res) => {
	const { bibliographicId, data, format } = req.body;

	try {
		let record;
		if (bibliographicId) {
			// Fetch the bibliographic record if bibliographicId is provided
			record = await Bibliographic.findById(bibliographicId);
			if (!record) {
				return res.status(404).json({ error: 'Bibliographic record not found' });
			}
		} else if (data) {
			// Use the provided data if bibliographicId is not available
			record = data;
		} else {
			return res.status(400).json({ error: 'Either bibliographicId or data must be provided' });
		}
		if (!record) {
			return res.status(404).json({ error: 'Bibliographic record not found' });
		}

		let extractedMetadata;
		switch (format.toLowerCase()) {
			case 'json':
				extractedMetadata = extractMetadataFromJson(record);
				break;
			case 'xml':
				extractedMetadata = await extractMetadataFromXml(record);
				break;
			case 'csv':
				extractedMetadata = await extractMetadataFromCsv(record);
				break;
			default:
				return res.status(400).json({ error: 'Unsupported format' });
		}

		res.json({
			message: 'Metadata extracted successfully',
			metadata: extractedMetadata,
		});
	} catch (error) {
		console.error('Error in extractMetadata:', error);
		res.status(500).json({ error: 'An error occurred while extracting metadata' });
	}
};

// exports.ensureQuality = (req, res) => {
// 	const { metadata, requiredFields, validationRules } = req.body;

// 	try {
// 		let Metafields = ensureRequiredFields(metadata, requiredFields);
// 		let ValidStatus = validateMetadataValues(metadata, validationRules);

// 		res.status(200).json({ message: 'Metadata is valid', Metafields, ValidStatus });
// 	} catch (error) {
// 		res.status(400).json({ error: error.message });
// 	}
// };

exports.validateMetadata = async (req, res) => {
	const { bibliographicId } = req.body;

	try {
		// Fetch the bibliographic record
		const record = await Bibliographic.findById(bibliographicId);
		if (!record) {
			return res.status(404).json({ error: 'Bibliographic record not found' });
		}

		// Perform basic validation
		const errors = [];
		if (!record.title) errors.push('Title is required');
		if (!record.author) errors.push('Author is required');
		if (!record.isbn) errors.push('ISBN is required');
		if (!record.publicationDate) errors.push('Publication date is required');

		// Check ISBN format (simple check for 10 or 13 digits)
		if (record.isbn && !/^\d{10}(\d{3})?$/.test(record.isbn)) {
			errors.push('Invalid ISBN format');
		}

		if (errors.length > 0) {
			return res.status(400).json({ errors });
		}

		// If validation passes, return the validated metadata
		res.json({
			message: 'Metadata is valid',
			metadata: {
				title: record.title,
				author: record.author,
				publicationDate: record.publicationDate,
				isbn: record.isbn,
			},
		});
	} catch (error) {
		res.status(500).json({ error: 'An error occurred during validation' });
	}
};

const generateSubjectHeading = (ddcCode, lccCode) => {
	// Example logic to generate subject headings dynamically
	// This function should be customized based on actual subject heading generation rules
	let subjectHeading = '';

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
		subjectHeading = 'Unknown Subject';
	}

	return subjectHeading;
};

/* prettier-ignore */
const getDdcDescription = (ddcCode) => {
	// Example logic to get DDC description
	// In a real-world scenario, you would look up descriptions from a reference table or API
	const ddcDescriptions = {
		'000': 'Generalities',
		'100': 'Philosophy & Psychology',
		'200': 'Religion',
		'300': 'Social Sciences',
		'400': 'Language',
		'500': 'Science',
		'600': 'Technology',
		'700': 'Arts & Recreation',
		'800': 'Literature',
		'900': 'History & Geography',
	};

	return ddcDescriptions[ddcCode] || null;
};

const getLccDescription = (lccCode) => {
	// Example logic to get LCC description
	// In a real-world scenario, you would look up descriptions from a reference table or API
	const lccDescriptions = {
		A: 'General Works',
		B: 'Philosophy, Psychology, Religion',
		BL: 'Religions. Mythology. Rationalism',
		HM: 'Sociology',
		P: 'Language and Literature',
		Q: 'Science',
		T: 'Technology',
		N: 'Fine Arts',
		PN: 'Literature (General)',
		D: 'History (General)',
	};

	return lccDescriptions[lccCode] || null;
};
