const convertDDCtoLCC = (ddc) => {
	// Dummy conversion logic
	const ddcToLccMap = {
		'DDC-123.45': 'LCC-AB123.45',
	};
	return ddcToLccMap[ddc] || 'LCC-XX000.00';
};

/* prettier-ignore */
const deweyToLccMap = {
    "000": { lcc: "A", subject: "General Works" },
    "100": { lcc: "B", subject: "Philosophy, Psychology" },
    "200": { lcc: "BL", subject: "Religion" },
    "300": { lcc: "H", subject: "Social Sciences" },
    "400": { lcc: "P", subject: "Language and Literature" },
    "500": { lcc: "Q", subject: "Science" },
    "510": { lcc: "QA", subject: "Mathematics" },
    "520": { lcc: "QB", subject: "Astronomy" },
    "530": { lcc: "QC", subject: "Physics" },
    "540": { lcc: "QD", subject: "Chemistry" },
    "550": { lcc: "QE", subject: "Earth Sciences" },
    "560": { lcc: "QE", subject: "Paleontology" },
    "570": { lcc: "QH", subject: "Biology" },
    "580": { lcc: "QK", subject: "Botany" },
    "590": { lcc: "QL", subject: "Zoology" },
    "600": { lcc: "T", subject: "Technology" },
    "610": { lcc: "R", subject: "Medicine" },
    "620": { lcc: "TA", subject: "Engineering" },
    "630": { lcc: "S", subject: "Agriculture" },
    "640": { lcc: "TX", subject: "Home Economics" },
    "650": { lcc: "HF", subject: "Commerce" },
    "660": { lcc: "TP", subject: "Chemical Engineering" },
    "670": { lcc: "TS", subject: "Manufacturing" },
    "680": { lcc: "TS", subject: "Manufacture for Specific Uses" },
    "690": { lcc: "TH", subject: "Building Construction" },
    "700": { lcc: "N", subject: "The Arts" },
    "710": { lcc: "NA", subject: "Architecture" },
    "720": { lcc: "NA", subject: "Architecture" },
    "730": { lcc: "NB", subject: "Sculpture" },
    "740": { lcc: "NC", subject: "Drawing, Design, and Illustration" },
    "750": { lcc: "ND", subject: "Painting" },
    "760": { lcc: "NE", subject: "Printmaking" },
    "770": { lcc: "TR", subject: "Photography" },
    "780": { lcc: "ML", subject: "Music" },
    "790": { lcc: "GV", subject: "Recreation, Leisure" },
    "800": { lcc: "PN", subject: "Literature" },
    "810": { lcc: "PS", subject: "American Literature" },
    "820": { lcc: "PR", subject: "English Literature" },
    "830": { lcc: "PT", subject: "German Literature" },
    "840": { lcc: "PQ", subject: "French Literature" },
    "850": { lcc: "PQ", subject: "Italian, Spanish, and Portuguese Literatures" },
    "860": { lcc: "PQ", subject: "Spanish Literature" },
    "870": { lcc: "PA", subject: "Classical Languages and Literatures" },
    "880": { lcc: "PA", subject: "Hellenic Languages and Literatures" },
    "890": { lcc: "PK", subject: "Indic Languages and Literatures" },
    "900": { lcc: "D", subject: "History and Geography" },
    "910": { lcc: "G", subject: "Geography and Travel" },
    "920": { lcc: "CT", subject: "Biography" },
    "930": { lcc: "CB", subject: "History of Civilization" },
    "940": { lcc: "D", subject: "History of Europe" },
    "950": { lcc: "DS", subject: "History of Asia" },
    "960": { lcc: "DT", subject: "History of Africa" },
    "970": { lcc: "E", subject: "History of North America" },
    "980": { lcc: "F", subject: "History of South America" },
    "990": { lcc: "DU", subject: "History of Australasia, Pacific Ocean Islands" }
};

// Helper function to convert DDC to LCC
const convertDeweyToLcc = (dewey) => {
	const deweyPrefix = dewey.substring(0, 3);
	return deweyToLccMap[deweyPrefix] || 'Unknown';
};

module.exports = { convertDDCtoLCC, convertDeweyToLcc };
