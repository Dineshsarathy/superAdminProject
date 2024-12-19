const mongoose = require('mongoose');
const validateEmail = (email) => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  };

  const ClientdetailsSchema = new mongoose.Schema({
    Client_id: {type: String, require:true, unique: true},
    Client_name: {type: String, require: true},
    Client_phone:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\+?(\d{1,3})?[-.\s]?(\(\d{1,4}\)|\d{1,4})[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    Client_emailid: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    HostedDate:{
        type: Date,
        required: true,
        default: Date.now},
    RenewalDate:{
        type: Date,
        required: true,
        default: Date.now},
    Domain:{type: String, require: true},
    Client_status:{type: Boolean, default: true, require: true},
    Temp_Admin:[{ type: mongoose.Schema.Types.ObjectId, ref: "templateAdmin" }]

  },{ timestamps: true});

  module.exports = mongoose.model('ClientDetails', ClientdetailsSchema);