const generateMARC21 = (bibliographicData) => {
    const { title, author, publicationDate, isbn } = bibliographicData;

    return `
        =LDR  00000nam a2200000 a 4500
        =001  ${isbn}
        =100  1\\$a${author}
        =245  10$a${title}
        =260  \\$bPublisher$c${publicationDate.getFullYear()}
        =300  \\$ap.
        =490  0\\$aSeries
        =650  \\$aSubject
    `;
};

module.exports = generateMARC21;
