const mongoose = require('mongoose');

const validateEmail = (email) => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  };

  const paymentSchema = new mongoose.Schema({
    Template_Id:[{ type: mongoose.Schema.Types.ObjectId, ref: "TemplateList" }],
    Admin_Id:[{ type: mongoose.Schema.Types.ObjectId, ref: "templateAdmin" }],
    Sub_Id:{type: String, require:true},
    Paid_Date:{
        type: Date,
        required: true,
        default: Date.now},
    Due_Date:{
        type: Date,
        required: true,
        default: Date.now},
        Plan_Amount:{type:Number, require:true}
  },
  { timestamps: true})

  module.exports = mongoose.model('Payments', paymentSchema);
