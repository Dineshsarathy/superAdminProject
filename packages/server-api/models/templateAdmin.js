const mongoose = require('mongoose');
const validateEmail = (email) => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  };

  const AdminSchema = new mongoose.Schema({
    Admin_id: {type: String, require: true},
    Admin_name: {type: String, require:true},
    Password:{type: String, require: true},
    Hosted_sites:{type: Number, require: true, default: 0},
    Email_id: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone_number: {
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
    Admin_status: {type: Boolean, default:true, require: true},
    Address: {type: String}
},
{ timestamps: true});

module.exports = mongoose.model('templateAdmin', AdminSchema);