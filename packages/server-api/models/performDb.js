const mongoose = require('mongoose');

const performSchema = new mongoose.Schema({
    Assigned_Task:{type: String, require:true},
    Emp_Id:{type: String, require:true},
    Task_Date:{
        type: Date,
        required: true,
        default: Date.now},
    Finshed_Task:{
        type: Date,
        required: true,
        default: Date.now},
    Work_Rating:{type: String, require:true},
    Salary_Level:{type: String, require:true},
    Employee:[{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }]
})

module.exports = mongoose.model('Performance', performSchema);