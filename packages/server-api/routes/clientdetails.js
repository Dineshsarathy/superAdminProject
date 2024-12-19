const express = require('express');
const router = express.Router();
const ClientDetails = require('../models/ClientDetails');
const templateAdmin = require('../models/templateAdmin');

//get all client details
router.get('/', async (req,res) => {
    try {
        const clients = await ClientDetails.find();
        res.json(clients);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//get by client id
router.get('/:id', async (req,res) => {
    try {
        const clients = await ClientDetails.findById(req.params.id);
        if(!ClientDetails){
            res.status(404).json({message:"Template Not Found"})
        }
        res.json(clients);
    } catch (error) {
        res.status(500).json({message: error.message})
    }    
});

//Creating new Client-Details

router.post('/', async (req, res) => {
    const clients = new ClientDetails({
        Client_id:req.body.Client_id,
        Client_name:req.body.Client_name,
        Client_phone:req.body.Client_phone,
        Client_emailid:req.body.Client_emailid,
        HosetedDate:req.body.HosetedDate,
        RenewalDate:req.body.RenewalDate,
        Domain:req.body.Domain,
        Client_status:req.body.Client_status,
    });
    try {
        const newClient = await clients.save();
        res.status(201).json(newClient);
    } catch (error) {
        res.status(400).json({message: error.message});
    }   
})

//update  clientdetails

router.put('/:id', async (req, res) => {
    try {
        // Find the template by ID
        const clients = await ClientDetails.findById(req.params.id);

        // Check if the template exists
        if (!clients) {
            return res.status(404).json({ message: "Template Not Found" });
        }

        // Update fields only if provided in req.body
        clients.Client_id = req.body.Client_id || clients.Client_id;
        clients.Client_name = req.body.Client_name || clients.Client_name;
        clients.Client_phone= req.body.Client_phone|| clients.Client_phone;
        clients.Client_emailid = req.body.Client_emailid || clients.Client_emailid;
        clients.HosetedDate = req.body.HosetedDate || clients.HosetedDate;
        clients.RenewalDate = req.body.RenewalDate || clients.RenewalDate;
        clients.Domain = req.body.Domain || clients.Domain;
        clients.Client_status = req.body.Client_status || clients.Client_status;

        // Update UpdatedAt timestamp if schema has timestamps enabled
        clients.UpdatedAt = Date.now();

        // Save updated template
        const updatedClient = await clients.save();

        // Send back the updated template in JSON format
        res.json(updatedClient);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})


//Delete a ClientDetails Data

router.delete('/:id', async (req, res) => {
    try {
        const clients = await ClientDetails.findById(req.params.id);
        if(!ClientDetails){
            return res.status(404).json({message: "Employee not found!"})
        }
        await ClientDetails.findByIdAndDelete(clients._id)
        res.json({message: `client detail of ${clients.Client_name} has been Deleted`})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// fetch template by employee
router.get('/admins/:adminId', async (req,res) => {
    try {
        const adminId=req.params.adminId;
        //Validate Category Id

        const adminExist = await templateAdmin.findById(adminId)
        if(!adminExist){
           return res.status(400).json({message:'Invalid Admin Id'});
        }

        //fetch template

            const clients= await ClientDetails.find({Temp_Admin:adminId}).populate({
                path: 'Temp_Admin',
                select: 'Admin_id' // Only include the Admin_id field from the referenced document
            });
            res.status(200).json(clients)

    } catch (error) {
        res.status(500).json({message: error.message});
    }    
})


module.exports = router;