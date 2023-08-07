const mongoose = require('mongoose');

const New = new mongoose.Schema({
  price_per_m2: { type: Number, require: true},
  published_at: { type: Date, require: true },
  last_time_in_page: { type: Date, require: true },
  district: { type: String, require: true },
  address: {type: String},
  news_id: {type: String},
  news_url: {type:String },
  total_price: {type: Number },
  base_project : {
    name: String,
    source: String,
    url: String,
    project_id: Number
  },
  street: {
    type: Object
  },
  commune: {
    type: String
  },
  district: {
    type: String
  },
  district: {
    type: String
  },
  square: Number,
  loc: {
    type: {
      type: String,
      enum: ['Point']
      
      },
    coordinates: {
      type: Array
      
    }
  }
  // Oter fields...
}
);
New.index({'loc': '2dsphere'}, { background: false })


module.exports = mongoose.model('New', New, 'new');
