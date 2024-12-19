const mongoose = require('mongoose');

const taskReportSchema = new mongoose.Schema({

    Employee:{type: String, require: true},
    Task_Id:{type: String, require: true, unique:true},
    AssignedTask:{type: String, require: true},
    AssignedBy:{type: String, require: true},
    AssignedDate:{
        type: Date,
        required: true
    },
    DueDate:{
        type: Date,
        required: true
    },
    CompletedDate:{
        type: Date,
        required: true
    },
    Delay:{type: String, require: true}
},{timestamps: true});

module.exports = mongoose.model('TaskReports', taskReportSchema);