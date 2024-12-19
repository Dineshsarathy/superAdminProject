const mongoose = require('mongoose');

const validateEmail = (email) => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  };

const HostedSiteSchema=new  mongoose.Schema({
    Domain:{type: String, require: true, unique: true},
    Template_Id:[{ type: mongoose.Schema.Types.ObjectId, ref: "TemplateList", unique: true }],
    Admin_Id:[{ type: mongoose.Schema.Types.ObjectId, ref: "templateAdmin" }],
    Admin_name:{type: String, require: true},
    Admin_emailid:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    Status: {type: Boolean, default:true, require: true},
    RenewalDate:{
        type: Date,
        required: true,
        default: Date.now},
    HostedDate:{
        type: Date,
        required: true,
        default: Date.now},
    Client_emailid:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
    Client_Id:
        {type: String, require: true, unique: true}
    },
{ timestamps: true})

module.exports = mongoose.model('HostedSites', HostedSiteSchema);