const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
    Temp_id: {type: String, require: true, unique: true},
    Temp_name: { type: String, require: true},
    Temp_category: { type: String, require: true},
    Temp_status:{type: String, require: true},
    CreatedBy:[{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    TestedBy:{type: String, require: true},
    Approval_status:{type: String, require: true},
    FilePath: {type: String, require: true},
    templateUrl:{type: String, require: true},
    usePort:{type:Number, require:true},
    CompletedDate:{
        type: Date,
        required: true,
        default: Date.now},
    ApprovedDate:{
        type: Date,
        required: true,
        default: Date.now},
    },{ timestamps: true});

module.exports = mongoose.model('TemplateList', TemplateSchema);

