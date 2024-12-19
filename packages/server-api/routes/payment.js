const express = require('express');
const router = express.Router();
const Payments = require('../models/Payments')
const templateAdmin = require('../models/templateAdmin');
const TemplateList = require('../models/TemplateList');


// Get al  payments

router.get('/', async (req, res) => {
    try {
        const payment = await Payments.find();
        res.json(payment)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/:id', async (req, res) => {
    try {
        const payment= await Payments.findById(req.params.id)
        if (!Payments) {
            res.status(404).json({message:"Payment Not Found"})
        }
        res.json(payment)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Create An Payment Detail

router.post('/', async (req, res) => {
    const payment = new Payments({

        Template_Id:req.body.Template_Id,
        Admin_Id:req.body.Admin_Id,
        Sub_Id:req.body.Sub_Id,
        Paid_Date:req.body.Paid_Date,
        Due_Date:req.body.Due_Date,
        Plan_Amount: req.body.Plan_Amount
    })
    try {
        const newPayment = await payment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})


//Update An Payment Details

router.put('/:id', async (req,res) => {
    try {
        const payment = await Payments.findById(req.params.id);

        if (!payment) {
            
            return res.status(404).json({ message: "Payment Not Found" });
        }

        payment.Template_Id = req.body.Template_Id || payment.Template_Id;
        payment.Admin_Id = req.body.Admin_Id || payment.Admin_Id;
        payment.Sub_Id = req.body.Sub_Id || payment.Sub_Id;
        payment.Paid_Date = req.body.Paid_Date || payment.Paid_Date;
        payment.Due_Date = req.body.Due_Date || payment.Due_Date;
        payment.Plan_Amount = req.body.Plan_Amount || payment.Plan_Amount;
        payment.updatedAt = Date.now();

        const updatedPayment = await payment.save();

        res.json(updatedPayment);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const payment = await Payments.findById(req.params.id)
        if (!Payments) {
            return res.status(404).json({message: "Employee not found!"})
        }
        await Payments.findByIdAndDelete(payment._id)
        res.json({message: `Payment Detail ${payment.Plan_Amount} has been Deleted`})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.get('/admin/:adminId', async (req, res) => {
    try {
        const adminId = req.params.adminId;

        // Validate Admin Id
        const adminExist = await templateAdmin.findById(adminId);
        if (!adminExist) {
            return res.status(400).json({ message: 'Invalid Admin Id' });
        }

        // Fetch Payments and populate Admin_Id field
        const payment = await Payments.find({ Admin_Id: adminId }).populate({
            path: 'Admin_Id',
            select: 'Admin_id' // Only include the Admin_id field from the referenced document
        });

        res.status(200).json(payment);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/template/:templateId', async (req,res) => {
    try {
        const templateId=req.params.templateId;
        
        //Validate Template_id...
        const templateExist = await TemplateList.findById(templateId)
        if(!templateExist){
           return res.status(400).json({message:'Invalid Template Id'});
        }
        //fetch template
            const payment= await Payments.find({Template_Id:templateId}).populate({
                path: 'Template_Id',
                select: 'Temp_id' // Only include the Admin_id field from the referenced document
            });
            res.status(200).json(payment)

    } catch (error) {
        res.status(500).json({message: error.message});
    }    
})


module.exports = router;