const express = require('express');
const router = express.Router();
const Performance= require('../models/performDb');
const TaskReports = require('../models/TaskReports');
const performDb = require('../models/performDb');

//Get All Performance 

router.get('/', async (req, res) => {
    try {
        const performance = await Performance.find();
        res.json(performance)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Get By Id

router.get('/:id', async (req,res) => {
    try {
        const perform = await Performance.findById(req.params.id);
        if (!Performance) {
            res.status(404).json({message:"Performer Not Found"})
        }
        res.json(perform);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Create a PerformDB Data

router.post('/', async (req, res) => {
    const performance = new Performance({
        Assigned_Task:req.body.Assigned_Task,
        Emp_Id:req.body.Emp_Id,
        Task_Date:req.body.Task_Date,
        Finshed_Task:req.body.Finshed_Task,
        Work_Rating:req.body.Work_Rating,
        Salary_Level:req.body.Salary_Level,

    });
    try {
        const newPerform= await performance.save();
        res.status(201).json(newPerform);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

//Update Performs

router.put('/:id', async (req, res) => {
    try {
        const performance = await Performance.findById(req.params.id);

        if (!performance) {
            return res.status(404).json({ message: "Template Not Found" });
        }

        performance.Assigned_Task = req.body.Assigned_Task || performance.Assigned_Task;
        performance.Emp_Id = req.body.Emp_Id || performance.Emp_Id;
        performance.Task_Date = req.body.Task_Date || performance.Task_Date;
        performance.Finshed_Task = req.body.Finshed_Task || performance.Finshed_Task;
        performance.Work_Rating = req.body.Work_Rating || performance.Work_Rating;
        performance.Salary_Level = req.body.Salary_Level || performance.Salary_Level;

        performance.updatedAt=Date.now();

        const updateTemp= await performance.save();

        res.json(updateTemp);


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Delete a Templated Date

router.delete('/:id', async (req, res) => {
    
    try {
        const perform = await Performance.findById(req.params.id);
        if (!Performance) {
            return res.status(404).json({message: "Perform not found!"})
        }
        await Performance.findByIdAndDelete(perform._id)
    } catch (error) {
        res.status(500).json({message: error.message});
    }

})

// fetch template by employee
router.get('/employees/:empId', async (req,res) => {
    try {
        const empId=req.params.empId;
        //Validate Category Id

        const empExist = await Employee.findById(empId)
        if(!empExist){
           return res.status(400).json({message:'Invalid Employee Id'});
        }

        //fetch template

            const performance= await performDb.find({Emp_Id:empId}).populate({
                path: 'Emp_Id',
                select: 'Employee_Id' // Only include the Admin_id field from the referenced document
            });
            res.status(200).json(performance)

    } catch (error) {
        res.status(500).json({message: error.message});
    }    
})


module.exports = router;