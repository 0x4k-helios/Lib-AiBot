const mongoose = require('mongoose');

const catalogSchema = new mongoose.Schema({
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Catalog', catalogSchema);