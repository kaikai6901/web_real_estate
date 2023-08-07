const mongoose = require('mongoose');

const baseProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  project_id: { type: Number, require: true},
  address: {type: Object},
  avg_total_price: { type: Number, require: false},
  avg_price_per_m2: { type: Number, require: false},
  avg_square: {type: Number, require: false},
  n_news: {type: Number, require: false},
  loc: {type: Object}
});

const BaseProject = mongoose.model('BaseProject', baseProjectSchema, 'base_project');

module.exports = BaseProject;
