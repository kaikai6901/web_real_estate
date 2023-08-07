const mongoose = require('mongoose')

const Feature = new mongoose.Schema({
    project_id : {type: Number},
    name: {type: String},
    loc: {type: Object},
    process_id: {type: Number}
    }
)

module.exports = mongoose.model('Feature', Feature, 'project_features');