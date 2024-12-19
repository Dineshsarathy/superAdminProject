const express = require('express');
const router = express.Router();
const HostedSite = require('../models/HostedSite');



//Get All Sites

router.get('/', async (req, res) => {
    try {
        const sites = await HostedSite.find();
        res.json(sites)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/:id', async (req, res) => {
    try {
        const sites = await HostedSite.findById(req.params.id);
        if (!HostedSite) {
            return res.status(404).json({message:"Site Not Found "});
        }
        res.json(sites);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.post('/', async (req, res) => {
    const sites = new HostedSite({
        Domain:req.body.Domain,
        Template_Id:req.body.Template_Id,
        Admin_Id:req.body.Admin_Id,
        Admin_name:req.body.Admin_name,
        Admin_emailid:req.body.Admin_emailid,
        Status:req.body.Status,
        RenewalDate:req.body.RenewalDate,
        HostedDate: req.body.HostedDate,
        Client_emailid:req.body.Client_emailid,
        Client_Id:req.body.Client_Id
});
try {
    const newSites = await sites.save();
    res.status(201).json(newSites);
} catch (error) {
    res.status(400).json({message: error.message});
}

})

//Update Hosted sites

router.put('/:id', async (req,res) => {
    try {
        const sites = await HostedSite.findById(req.params.id);
        if(!sites){
            return res.status(404).json({message: "Template Not Found"});
        }

        sites.Domain = req.body.Domain || sites.Domain;
        sites.Template_Id = req.body.Template_Id || sites.Template_Id;
        sites.Admin_Id = req.body.Admin_Id || sites.Admin_Id;
        sites.Admin_name = req.body.Admin_name || sites.Admin_name;
        sites.Admin_emailid = req.body.Admin_emailid || sites.Admin_emailid;
        sites.Status = req.body.Status || sites.Status;
        sites.RenewalDate = req.body.RenewalDate || sites.RenewalDate;
        sites.HostedDate = req.body.HostedDate || sites.HostedDate;
        sites.Client_emailid = req.body.Client_emailid || sites.Client_emailid;
        sites.Client_Id = req.body.Client_Id || sites.Client_Id;

        sites.UpdatedAt = Date.now();

        const updatedSites = await sites.save();

        res.json(updatedSites);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Delete a Sites data

router.delete('/:id', async (req, res) => {
    try {
        const sites = await HostedSite.findById(req.params.id);
        if(!HostedSite){
            return res.status(404).json({message: "Site details not found"})
        }
        await HostedSite.findByIdAndDelete(sites._id)
        res.json({message:`Site ${sites.Domain} Successfully Deleted`})
    } catch (error) {
        res.status(500).json({message: error.message});
    }    
})

// fetch Temp_Id by Templists
router.get('/templists/:templateId', async (req,res) => {
    try {
        const templateId=req.params.templateId;
        //Validate Category Id

        const templateExist = await TemplateList.findById(templateId)
        if(!templateExist){
           return res.status(400).json({message:'Invalid Template Id'});
        }

        //fetch template

            const sites= await HostedSite.find({Template_Id:templateId}).populate('Template_Id');
            res.status(200).json(sites)

    } catch (error) {
        res.status(500).json({message: error.message});
    }    
})

// fetch Temp_Id by Templists
router.get('/admin/:adminId', async (req,res) => {
    try {
        const adminId=req.params.adminId;
        //Validate Category Id

        const adminExist = await templateAdmin.findById(adminId)
        if(!adminExist){
           return res.status(400).json({message:'Invalid Template Id'});
        }

        //fetch template

            const sites= await HostedSite.find({Admin_Id:adminId}).populate('Admin_Id');
            res.status(200).json(sites)

    } catch (error) {
        res.status(500).json({message: error.message});
    }    
})


router.get('/admin/', async (req, res) => {
    try {
        const admin = await Post.aggregate([
            {
                $lookup: {
                    from: 'HostedSites', // The collection to join
                    localField: 'Admin_Id', // Field in posts collection
                    foreignField: '_id', // Field in users collection
                    as: 'Admin' // The alias for the joined data
                }
            },
            {
                $unwind: '$Admin' // Flatten the userDetails array
            }
        ]);

        res.json(admin); // Send the aggregated data as a response
    } catch (err) {
        console.error(err);
        res.status(500).send('Error aggregating data');
    }
});

module.exports=router;