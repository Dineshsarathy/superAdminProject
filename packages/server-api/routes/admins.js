const express = require('express');
const router = express.Router();
const Admin = require('../models/templateAdmin');
const templateAdmin = require('../models/templateAdmin');


// Get All Admins

router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
        } catch (error) {
            res.status(500).json({message: error.message});
    }
})

// get admins by id
router.get('/:id', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if(!Admin){
          return res.status(404).json({message: "Admin not Found!"})
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
} )

//Create Admin
router.post('/', async (req,res) => {
    const admin = new Admin({
        Admin_id: req.body.Admin_id,
        Admin_name: req.body.Admin_name,
        phone_number: req.body.phone_number,
        Password:req.body.Password,
        Email_id: req.body.Email_id,
        Admin_status: req.body.Admin_status,
        Address: req.body.Address
    });
    try {
        const newAdmin = await admin.save();
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})


//Update Admin data

router.put('/:id', async (req, res) => {
    try {
        // Find employee by ID
        const admin= await Admin.findById(req.params.id);

        // Check if the employee exists
        if (!admin) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Update fields only if provided in req.body
        admin.Admin_id = req.body.Admin_id || admin.Admin_id;
        admin.Admin_name = req.body.Admin_name || admin.Admin_name;
        admin.Password = req.body.Password || admin.Password;
        admin.phone_number = req.body.phone_number || admin.phone_number;
        admin.Email_id = req.body.Email_id || admin.Email_id;
        admin.Admin_status = req.body.Admin_status !== undefined ? req.body.Admin_status : admin.Admin_status;
        admin.Address = req.body.Address || admin.Address;
        
        // Set UpdatedAt field to current time
        admin.UpdatedAt = Date.now();

        // Save updated employee to the database
        const UpdatedAdmin = await admin.save();
        
        // Respond with the updated employee
        res.json(UpdatedAdmin);

    } catch (error) {
        // Handle any errors
        res.status(400).json({ message: error.message });
    }    
})

//Delete User

router.delete('/:id', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if(!Admin){
            return res.status(404).json({message: "User not found!"})
        }
        await Admin.findByIdAndDelete(admin._id)
        res.json({message: `User ${admin.Admin_name} has been Deleted`})
    } catch (error) {
        res.status(500).json({message: error.message});
    }    
})




module.exports = router;